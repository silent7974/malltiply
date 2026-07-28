// Seller

- [ ] Products should have a slice that holds all the data ✅
- [ ] SellerNavbar profile image and first name not updating until I enter the profile settings page and load it ✅
- [ ] In Profile settings page, the delete button does not clear the deleted seller products and stores for premium_seller from the database ✅
- [ ] The sidebar triggered by the hamburger menu should feel bouncy (ease in out back animation) ✅
- [ ] Products related data UI should be stored in a redux slice ✅
- [ ] There should be a size guide in products form page ()✅
- [ ] Category in both products add/edit pages should not be fetched from 'sellerToken' but from the sellerProfileSlice.js ✅
- [ ] When I try to get inside /normal/dashboard/settings it keeps sending infinite GET request to fetch the profile and doesn't load at all✅
- [ ] In the MenuModal (signed in as a premium seller) the "Logout" button is not visible and I can't tell if it's just below until I make the modal scrollable or it just doesn't exist at all ✅
- [ ] Seller signin error messages are not specific. Just throws "Signin failed"✅ (for security reasons)
- [ ] On the little phone screen replace $ with ₦ in /seller (remove foreign language)✅
- [ ] Forms need placeholders and more polishing (forgot password needs to work)✅
- [ ] I switched premium seller to normal seller? I still have to refresh the page before the view updates✅
- [ ] After signing in as a normal seller I get redirected to the signin page until I manually change the URL to /seller/normal/dashboard✅
- [ ] /settings (seller-side) redirects to /signin when there's an error ✅
- [ ] Redisign store card in /premium/dashboard ✅


- [ ] Must study more of inventory tracking (How does it work if they're multiple same sku in the database?, In FeaturedSection.jsx what if the base product is not under limited stock but one of it variant is?)
- [ ] Total calculation of a single order is only accurate under "All" seller-side. (All carousels can share a template) 
- [ ] Use case, trending and tags must exist but infered not inputed by seller
- [ ] The input field in ColorPickerModal does not modify the chosen color
- [ ] Heavy images should not be allowed.
- [ ] In MultiImageUpload as a premium seller in edit mode, the seller can't remove ad and save. They can only update it
- [ ] The link button in StoreHeader should be able to copy the seller's store URL
- [ ] /seller/signup are using the same template for district dropdown. Turn it into a reusable component
- [ ] Toggling the notifications button in /seller/settings has to load the page first
- [ ] ProfileInfoForm should know if it's a premium seller; A brand name field should also be included
- [ ] The dashboards layout should not be allowed to be seen completely even if seller profile doesn't exist (I think this can be controlled by middleware.js)
- [ ] I can't sign in as a seller and get routed to dashboard in production like I normally can local mode



// Buyer

- The time and date on the order status modals supposed to be relevant to the time the order status changed (not just when the order started)
- A signed user has no button or navigations to sign out at all.
- Order email notifications are sent twice. Also need to test to make sure gmail doesn't throw them under "Spam" and actually notify buyers.
- The cart button on product cards doesn't do anything. The aim is to create a modal to manage the product in cart faster. The modal should have similar styling with the InfoModal - just with more features within it.
- No delivery API integrated. Should try Bolt (GIG seems more costly for a lightweight product delivered within Abuja).
- No recommendations to sign up an account for a guest who just completed an order. No review system, not even recommendations on similar products - doesn't seem like anything for retention is planned.
- Need to ensure a guest who turns to a user (with existing account) have their orders when they were guests is embedded.
- There's no "cancelled" status for orderStatus and that should exist just to log orders that failed and were not paid.
- The default status of refund is "requested" when no one requested anything. Never even tested the refund functionality.
- Need to make the search system smarter with images as results not just product names, and also need to build a PLP. But not urgent yet - maybe for scale.
- Categories page has nothing, just "Use the searchbar to find products. Categories will appear here as the catalogue grows".
- The order record stores the guestInfo but not an existing user (even basic info like the guests).
- Under the contact support section in the footer; there's currently a direction "Tap the WhatsApp support option to start a conversation". There should be a whatsApp button (clear icon) that routes to my whatsApp.
- The subtype category tabs overflows out of the screen - it should be contained same as the subcategory and category tabs
- 