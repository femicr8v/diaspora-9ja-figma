Based on our testing, here are the URLs you can use to access the thank-you page:

✅ Working Thank-You Page URLs:

1. Successful Payment (Shows Full Thank-You Page)
   http://localhost:3000/thank-you?session_id=cs_test_a17aZ24W0FnzacggZ2zNPTDG8CgSKTQe3NaglpQ6wcyVbydXFwk2dLvxuA
   This shows the complete success page with:

"Your payment was successful, John Test User!"
Welcome benefits
"What's Next?" section
Dashboard and Home buttons 2. Successful Retry Payment (Also Shows Full Thank-You Page)
http://localhost:3000/thank-you?session_id=cs_test_retry_session_456
This shows:

"Your payment was successful, Failed Payment User!"
Full success page layout 3. Failed Payment (Shows Access Denied)
http://localhost:3000/thank-you?session_id=cs_test_failed_session_123
This shows the error state:

"Access Denied" page
"Complete Payment" and "Return Home" buttons 4. No Session ID (Shows Access Denied)
http://localhost:3000/thank-you
This shows the error state for missing payment verification.

🎯 For Development/Testing:
If you want to quickly access the thank-you page while developing, I recommend using:

http://localhost:3000/thank-you?session_id=cs_test_a17aZ24W0FnzacggZ2zNPTDG8CgSKTQe3NaglpQ6wcyVbydXFwk2dLvxuA
This will show you the full successful payment experience so you can see all the components and make your modifications.
