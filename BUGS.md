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



// Buyer

- [ ] Banner redesign for even smaller screens
- [ ] In AllTabContent.jsx there's a "0" that shows next to prices of products that don't have discounts
- [ ] The modal (ProfileModal.jsx) is not responsive as screen gets smaller
- [ ] What happens in productSchema and cartSchema when a product has a memory, measurement, RAM or other variant attributes aside colors and sizes?
- [ ] The cart button in the productDetailspage transitions back to "Add to cart" after every tap on a '-' or '+' button
- [ ] The AddToCartButton and the "+" button in cart page exceeds the stock of item left
- [ ] User fullName and phone are under shippingAddress in the orderSchema but they don't get saved probably because frontend (CheckoutPage.jsx) doesn't send them
- [ ] Forms need placeholders and more polishing (forgot password needs to work)
- [ ] Cart page is not protected - anybody could visit anybody's cart even a non-user (guest)