import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { backendClient } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "No Signature found for stripe" },
      { status: 400 }
    );
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.log("Stripe webhook secret is not set");
    return NextResponse.json(
      {
        error: "Stripe webhook secret is not set",
      },
      { status: 400 }
    );
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      {
        error: `Webhook Error: ${error}`,
      },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const invoice = session.invoice
      ? await stripe.invoices.retrieve(session.invoice as string)
      : null;

    try {
      // Get metadata from the session
      const metadata = session.metadata as unknown as Metadata;
      
      // Create order in Sanity
      await backendClient.create({
        _type: 'order',
        orderNumber: metadata.orderNumber,
        customer: {
          name: metadata.customerName,
          email: metadata.customerEmail,
          clerkUserId: metadata.clerkUserId,
        },
        shippingAddress: metadata.address,
        items: session.line_items?.data.map(item => ({
          _type: 'orderItem',
          product: {
            _type: 'reference',
            _ref: item.price?.metadata?.id,
          },
          quantity: item.quantity,
          size: item.price?.metadata?.size || null,
          price: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
        })) || [],
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
        paymentStatus: 'paid',
        orderStatus: 'pending',
        paymentMethod: 'stripe',
        stripeCheckoutId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        stripeCustomerId: session.customer as string,
        stripeInvoiceId: invoice?.id,
        stripeInvoiceUrl: invoice?.hosted_invoice_url,
        createdAt: new Date().toISOString(),
      });

    } catch (error) {
      console.error("Error creating order in sanity:", error);
      return NextResponse.json(
        {
          error: `Error creating order: ${error}`,
        },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ received: true });
} 