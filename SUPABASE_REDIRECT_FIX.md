# Fixing Stripe Redirect URL in Supabase

The issue you are facing where users are redirected to `https://xzqyctdsftsvkvvhdwvl.supabase.co/payment/success` after payment instead of your local application is because the **Supabase Edge Function** (`create-package-checkout`) is currently using a hardcoded or default URL for the Stripe success redirect, ignoring the frontend request.

Since the backend code is hosted on Supabase and not in this repository, you must update the Edge Function directly in your Supabase Dashboard or local functions directory.

## Steps to Fix

1.  **Locate the Function**: Find the `create-package-checkout` function in your Supabase project.

2.  **Update the Code**: Modify the function to accept `success_url` and `cancel_url` from the request body and use them when creating the Stripe Session.

   Here is how the code likely looks and how it **needs to trigger**:
   
   ```typescript
   // BEFORE (Likely Implementation)
   const session = await stripe.checkout.sessions.create({
     success_url: `${req.headers.get("origin")}/payment/success`, // OR hardcoded supabase URL
     cancel_url: `${req.headers.get("origin")}/cancel`,
     ...
   });

   // AFTER (Correct Implementation)
   const { package_id, success_url, cancel_url } = await req.json();

   const session = await stripe.checkout.sessions.create({
     // Use the URL provided by the frontend, fallback to default if missing
     success_url: success_url || `${req.headers.get("origin")}/payment/success`,
     cancel_url: cancel_url || `${req.headers.get("origin")}/cancel`,
     mode: 'payment',
     // ... other params
   });
   ```

3.  **Deploy**: Save and deploy the updated function.

Once updated, the frontend changes I made (sending `window.location.origin + "/payment/success"`) will successfully tell Stripe to redirect the user back to your local application after payment.
