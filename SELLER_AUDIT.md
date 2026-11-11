| File | What it does | Where it is used | Calls (API / Redux) | Problems seen | Status |
|---|---|---|---|---|---|
| src/app/seller/page.jsx | Landing page for seller center with basic information | /seller | none found | none found | works |
| src/app/seller/components/FaqDropdown.jsx | FAQ section for sellers | src/app/seller/page.jsx | none found | Hardcoded FAQ questions & answers array (faqData) | works |
| src/app/seller/components/ForgotPasswordModal.jsx | Modal for resetting password | src/app/seller/signin/page.jsx | useForgotPasswordMutation | none found | works |
| src/app/seller/components/MenuModal.jsx | Menu modal for seller dashboard | src/app/seller/normal/dashboard/SellerNavbar.jsx; src/app/seller/premium/dashboard/PremiumNavbar.jsx | useLogoutMutation; useSelector; useDispatch (sellerApi.util.resetApiState(, resetProfile(); sellerProfileSlice | none found | works |
| src/app/seller/components/SellerCategoryDropdown.jsx | Dropdown for selecting seller categories | src/app/seller/components/profile/ProfileInfoForm.jsx; src/app/seller/normal/signup/page.jsx; src/app/seller/premium/signup/page.jsx | none found | none found | works |
| src/app/seller/components/SignupModal.jsx | Signup modal for sellers | src/app/seller/page.jsx | none found | none found | works |
| src/app/seller/components/SuccessModal.jsx | Shows success message after signup | src/app/seller/normal/signup/page.jsx; src/app/seller/premium/signup/page.jsx | none found | none found | works |
| src/app/seller/components/orders/AllOrders.jsx | calculation of the sum of all orders in checkout page | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery, useGetProfileQuery | Hardcoded date filter options array (FILTERS) | works |
| src/app/seller/components/orders/CancelledOrders.jsx | what will happen when an order is cancelled | src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery | Hardcoded date filter options array (FILTERS) | works |
| src/app/seller/components/orders/DeliveredOrders.jsx | it tracks order before and after it is delivered | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery | Hardcoded date filter options array (FILTERS) | works |
| src/app/seller/components/orders/OrderDetails.jsx | details needed to be known by the seller about the order for updating order status. | src/app/orders/page.jsx; src/app/seller/components/orders/AllOrders.jsx; src/app/seller/components/orders/CancelledOrders.jsx; src/app/seller/components/orders/DeliveredOrders.jsx; src/app/seller/components/orders/PendingOrders.jsx (+2 more) | none found | none found | works |
| src/app/seller/components/orders/PendingOrders.jsx | showing pending orders and it's details | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery, useUpdateOrderStatusMutation | Hardcoded date filter options array (FILTERS) | works |
| src/app/seller/components/orders/ProcessingOrders.jsx | showing processing orders and it's details before it is shipped | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery, useUpdateOrderStatusMutation | Hardcoded date filter options array (FILTERS) | works |
| src/app/seller/components/orders/ShippedOrders.jsx | showing shipped orders and it's details before it is delivered | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery | Hardcoded date filter options array (FILTERS); Track Shipment button has no onClick handler (L181) | works |
| src/app/seller/components/products/MultiImageUpload.jsx | uploads images for the products and a video and renderring video and images in the frontend. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | 5 alert(); Big commented-out code (L203-211, L224-279); Hardcoded 50MB video / 5MB image limits | works |
| src/app/seller/components/products/ProductBasicDetails.jsx | generate SKU which i think is the details of the product that are going to be shown in the frontend like name, color, size etc. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | none found | works |
| src/app/seller/components/products/ProductFormFields.jsx | custom color selector for products when uploading. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | Hardcoded color palette array (colors) | works |
| src/app/seller/components/products/ProductVariantEditor.jsx | used for editing the variants of the products which is products name, color, sizes, measurement, quantity and price. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | Hardcoded color palette array (colors) | works |
| src/app/seller/components/profile/ChangePasswordForm.jsx | used for changing the password of the user. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | axios (axios.put("/api/seller/profile") | Hardcoded password length rule (< 8); Direct axios call instead of RTK Query | works |
| src/app/seller/components/profile/DeleteAccountButton.jsx | used for deleting the account of the user. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useDeleteAccountMutation; useSelector; useDispatch (unused) | 1 alert() at L22; useDispatch initialized but unused | works |
| src/app/seller/components/profile/NotificationToggle.jsx | enabling and disabling of notifications from malltiply | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useUpdateProfileMutation; useSelector; useDispatch (toggleNotification(); sellerProfileSlice | 1 console.log at L22 | works |
| src/app/seller/components/profile/ProfileInfoForm.jsx | where user fill in the info needeed to identify them and save their log.. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useGetProfileQuery; useSelector | none found | works |
| src/app/seller/components/profile/ProfilePictureForm.jsx | uploading and deleting profile picture for users. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useSelector; useDispatch (setProfile({ profileImage: objectUrl }, deleteProfilePicture(); sellerProfileSlice | Commented-out code (L79-92, 14 lines) | works |
| src/app/seller/components/store/AddCategoryModal.jsx | used for adding a category to the store. | src/app/seller/components/store/StoreCategories.jsx | useGetProductsQuery; useSelector; useDispatch (setStoreCategories({ suggested: [], fromProducts: selected, }); storeSlice | none found | works |
| src/app/seller/components/store/BrandTheme.jsx | used for applying theme to the store. | src/app/seller/premium/dashboard/store/page.jsx | useSelector; useDispatch (setBrandColor(color); storeSlice | none found | works |
| src/app/seller/components/store/CategoriesTabs.jsx | showcasing the tabs categories for product | src/app/seller/components/store/PreviewStore.jsx | useGetProductsByStoreQuery; useSelector | Category tab buttons have no onClick filter handler (L45) | works |
| src/app/seller/components/store/CategoryChip.jsx | used for displaying the categories of the store. | src/app/seller/components/store/AddCategoryModal.jsx | none found | none found | not sure |
| src/app/seller/components/store/ColorPickerModal.jsx | color assigner and selection for seller's product | src/app/seller/components/store/BrandTheme.jsx | useSelector; useDispatch (setBrandColor(color); storeSlice | none found | works |
| src/app/seller/components/store/PreviewFooter.jsx | used for displaying the footer of the store. | src/app/seller/components/store/PreviewStore.jsx | useGetMyStoreQuery; useSelector | Hardcoded social icons configuration array | not sure |
| src/app/seller/components/store/PreviewStore.jsx | preview store for premium users to see how their store looks | src/app/seller/components/store/StoreHeader.jsx | useGetMyStoreQuery; useSelector | none found | works |
| src/app/seller/components/store/PreviewStory.jsx | used for previewing the stories of the store | src/app/seller/components/store/PreviewStore.jsx | useSelector | none found | not sure |
| src/app/seller/components/store/StoreAppearance.jsx | used for displaying the appearance of the store | src/app/seller/premium/dashboard/store/page.jsx | useSelector; useDispatch (setVideo({ previewUrl }, setBanner({ previewUrl }, toggleVideoMute(...); storeSlice | 4 alert() (L54, L59, L62, L72); Hardcoded 50MB video / 5MB banner limits | works |
| src/app/seller/components/store/StoreCategories.jsx | it's launcher that is a grey button that says “Add category”. Clicking the button opens AddCategoryModal | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | none found | none found | works |
| src/app/seller/components/store/StoreFooter.jsx | It’s the settings form for the store’s footer. | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | useSelector; useDispatch (setStoreTagline(e.target.value, setSocial({ platform: "instagram", value: e.target.value, }, setSocial({ platform: "tiktok", value: e.target.value, }...); storeSlice | none found | works |
| src/app/seller/components/store/StoreHeader.jsx | used for displaying the header of the store | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | useGetMyStoreQuery | none found | not sure |
| src/app/seller/components/store/StoreStory.jsx | used for displaying the stories of the store | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | fetch (Cloudinary upload); useSelector; useDispatch (addStoryImage(res.secure_url, setStoryHeadline(e.target.value, setStoryDescription(e.target.value...); storeSlice | 1 alert() at L43 | not sure |
| src/app/seller/normal/dashboard/layout.jsx | Layout for normal sellers dashboard | /seller/normal/dashboard | useGetProfileQuery | none found | works |
| src/app/seller/normal/dashboard/page.jsx | Normal sellers dashboard | /seller/normal/dashboard | none found | none found | Unfinished |
| src/app/seller/normal/dashboard/SellerNavbar.jsx | Navigation bar for normal sellers | src/app/seller/normal/dashboard/layout.jsx | useSelector | none found | works |
| src/app/seller/normal/dashboard/help/page.jsx | Normal sellers help page | /seller/normal/dashboard/help | none found | Half-finished (6-line stub page with no content) | Unfinished |
| src/app/seller/normal/dashboard/orders/page.jsx | Normal sellers orders page | /seller/normal/dashboard/orders | none found | Action button has no onClick handler (L45) | works |
| src/app/seller/normal/dashboard/payments/page.jsx | Normal sellers payments page | /seller/normal/dashboard/payments | none found | Half-finished (6-line stub page with no content) | Unfinished |
| src/app/seller/normal/dashboard/products/page.jsx | Normal sellers products page | /seller/normal/dashboard/products | useGetProductsQuery; useDispatch (setCurrentProduct, resetCurrentProduct); productSlice | none found | works |
| src/app/seller/normal/dashboard/products/form/page.jsx | Normal sellers products form | /seller/normal/dashboard/products/form | useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation; fetch (Cloudinary upload); useSelector; useDispatch (resetCurrentProduct(); productSlice | 2 console.log (L131, L144) | works |
| src/app/seller/normal/dashboard/settings/page.jsx | Normal sellers settings page | /seller/normal/dashboard/settings | useUpdateProfileMutation; fetch (Cloudinary upload); useSelector; useDispatch (unused) | 1 alert() at L64; 1 console.log at L63; useDispatch imported but unused | works |
| src/app/seller/normal/signup/page.jsx | Normal sellers signup page | /seller/normal/signup | useSignupMutation | 1 console.log at L88; Hardcoded password length rule (>= 8) | works |
| src/app/seller/premium/dashboard/layout.jsx | Layout for premium sellers dashboard | /seller/premium/dashboard | useGetProfileQuery | none found | works |
| src/app/seller/premium/dashboard/page.jsx | Premium sellers dashboard | /seller/premium/dashboard | none found | Half-finished (links to non-existent /seller/premium/dashboard/help) | Unfinished |
| src/app/seller/premium/dashboard/PremiumNavbar.jsx | Navigation bar for premium sellers | src/app/seller/premium/dashboard/layout.jsx | useSelector | none found | works |
| src/app/seller/premium/dashboard/orders/page.jsx | Premium sellers orders page | /seller/premium/dashboard/orders | none found | Action button has no onClick handler (L45) | works |
| src/app/seller/premium/dashboard/products/page.jsx | Premium sellers products page | /seller/premium/dashboard/products | useGetProductsQuery; useDispatch (setCurrentProduct, resetCurrentProduct); productSlice | none found | works |
| src/app/seller/premium/dashboard/products/form/page.jsx | Premium sellers products form | /seller/premium/dashboard/products/form | useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation; fetch (Cloudinary upload); useSelector; useDispatch (resetCurrentProduct(); productSlice | 2 console.log (L147, L160) | works |
| src/app/seller/premium/dashboard/settings/page.jsx | Premium sellers settings page | /seller/premium/dashboard/settings | useUpdateProfileMutation; fetch (Cloudinary upload); useSelector; useDispatch (unused) | 1 alert() at L64; 1 console.log at L63; useDispatch imported but unused | works |
| src/app/seller/premium/dashboard/store/page.jsx | Premium sellers store page | /seller/premium/dashboard/store | useUpdateMyStoreMutation, useGetMyStoreQuery; fetch (Cloudinary upload); useSelector; useDispatch (hydrateFromStore(store); storeSlice | 2 alert() (L72, L75); 1 console.log at L74 | works |
| src/app/seller/premium/signup/page.jsx | Premium sellers signup page | /seller/premium/signup | useSignupMutation | 1 alert() at L84; 1 console.log at L83 | works |
| src/app/seller/privacy/page.jsx | Privacy page for sellers | /seller/privacy | none found | none found | works |
| src/app/seller/signin/page.jsx | Signin page for sellers | /seller/signin | useSigninMutation; useDispatch (sellerApi.endpoints.getProfile.initiate() | Hardcoded password length rule (< 8) | works |




PART B: WORDS ON SCREEN

| File | Exact text | What is wrong |
|---|---|---|
| src/app/seller/page.jsx | Upload once, buyers order directly, delivered safely in Abuja | claim ("delivered safely"), Abuja only, ad tone (1,5) |
| src/app/seller/page.jsx | Your products are visible to buyers in Abuja and beyond. No tech skills needed, just upload and start selling. | claims about reach, ad tone (1,5) |
| src/app/seller/page.jsx | Create an account, upload products, and manage your store in minutes. Everything is guided and straightforward. | "in minutes" claim, says manage your store but stores are premium only (1,3,5) |
| src/app/seller/page.jsx | All sellers are verified, payments are secure, deliveries tracked. Buyers know they can trust your store. | strong claims, grammar (1,4) |
| src/app/seller/page.jsx | Upgrade to a premium store for customization and highlights. No pressure, only if you want more visibility. | explains Normal vs Premium, ad tone, "highlights" unclear (3,5) |
| src/app/seller/page.jsx | Sell your fashion products in one simple marketplace | promotional marketing claim, ad tone (1,5) |
| src/app/seller/page.jsx | 1 Minute Create account / 2 Minutes Upload products / 5 Minutes Customize store | arbitrary time promises and numeric claims (1,2) |
| src/app/seller/page.jsx | Get discovered by real buyers | ad slogan tone, implies buyers elsewhere are fake (1,5) |
| src/app/seller/page.jsx | Setup is simple | subjective ease-of-use claim (1) |
| src/app/seller/components/FaqDropdown.jsx | Selling on Malltiply is free for basic sellers. A commission is applied per completed order. Premium seller plans are optional and priced monthly. | claims, calls Normal "basic", no commission or price given (1,3) |
| src/app/seller/components/FaqDropdown.jsx | Payments are released to sellers after successful delivery is confirmed. | payout promise, differs from the wallet message (1) |
| src/app/seller/components/SignupModal.jsx | Sign up as... | informal trailing ellipsis (4) |
| src/app/seller/components/SellerCategoryDropdown.jsx | Kids Fashion / Kid's Fashion | duplicate category, apostrophe inconsistency (4) |
| src/app/seller/components/orders/DeliveredOrders.jsx | Funds will reflect in your wallet shortly | vague promise, mentions a wallet (1) |
| src/app/seller/components/orders/CancelledOrders.jsx | This order was canceled | spelled "canceled" but "cancelled" is used elsewhere (4) |
| src/app/seller/components/orders/CancelledOrders.jsx | No actions required | plural/singular mismatch, should be "No action required" (4) |
| src/app/seller/components/orders/ProcessingOrders.jsx | Your items are ready. Malltiply is assigning a courier for pickup | claim about courier, no full stop (1,4) |
| src/app/seller/components/orders/ShippedOrders.jsx | Tracking available in order details | claim, order details has no tracking info/number (1) |
| src/app/seller/components/orders/OrderDetails.jsx | Delivery method: GIG | hardcodes GIG courier as delivery method for all orders (1,5) |
| src/app/seller/components/products/MultiImageUpload.jsx | You can upload a maximum of ${MAX_IMAGES} images | limit shown to seller (2) |
| src/app/seller/components/products/MultiImageUpload.jsx | Image must be at least 400×400 | alert validation says 400×400 but text below says 800x800 (2,4) |
| src/app/seller/components/products/MultiImageUpload.jsx | Video resolution below 720p. Not recommended. | number (2) |
| src/app/seller/components/products/MultiImageUpload.jsx | Video must not exceed 30 seconds. | hardcoded limit in alert (2) |
| src/app/seller/components/products/MultiImageUpload.jsx | Max 30 seconds – MP4 recommended – minimum 720p recommended | hardcoded limits (2) |
| src/app/seller/components/products/MultiImageUpload.jsx | Minimum resolution must be 800x800 | "x" here but "×" elsewhere (2,4) |
| src/app/seller/components/products/MultiImageUpload.jsx | Upgrade to a premium seller to upload video ad and more images | explains Normal vs Premium, grammar (3,4) |
| src/app/seller/components/products/MultiImageUpload.jsx | Adding a short product ad helps buyers understand your product better | claim, ad tone (1,5) |
| src/app/seller/components/products/ProductBasicDetails.jsx | Getzner Shadda - Prestige Edition | luxury branded placeholder (5) |
| src/app/seller/components/products/ProductBasicDetails.jsx | Original Getzner shadda with a rich texture and smooth finish. Ideal for traditional wear and special events. | sample text reads like an ad and claims "Original" (1,5) |
| src/app/seller/components/products/ProductBasicDetails.jsx | {length} / 180 | numeric limit displayed directly (2) |
| src/app/seller/components/products/ProductVariantEditor.jsx | Variants: {count} / {maxVariants} | hardcoded numeric limit, Normal has 10 max while Premium has 9 max (2,3) |
| src/app/seller/components/products/ProductVariantEditor.jsx | To add more variants upgrade to premium seller | explains Normal vs Premium, missing comma and "a" (3,4) |
| src/app/seller/components/products/ProductVariantEditor.jsx | SKU format: FIRST3(Product) - FIRST3(Var1) - FIRST3(Var2) - qty | jargon, unclear to a seller (5) |
| src/app/seller/components/profile/ChangePasswordForm.jsx | Password must be at least 8 characters | rule with a number, premium signup has no such rule (2) |
| src/app/seller/components/profile/ChangePasswordForm.jsx | Password must include letters, numbers, and symbols | complexity rule not enforced on premium signup (2) |
| src/app/seller/components/profile/ChangePasswordForm.jsx | Confirm old password | label says confirm but the error says "Current password" (4) |
| src/app/seller/components/profile/DeleteAccountButton.jsx | Failed to delete account: | raw error is appended in an alert (5) |
| src/app/seller/components/profile/ProfileInfoForm.jsx | Phone No | signup says "Phone Number" (4) |
| src/app/seller/components/store/BrandTheme.jsx | Pick a color that represents your brand. We’ll use it in your shop theme | no full stop, "shop" vs "store" (4) |
| src/app/seller/components/store/PreviewFooter.jsx | Powered by Malltiply | platform branding on the seller store, intended? (5) |
| src/app/seller/components/store/StoreAppearance.jsx | Minimum resolution must be 800×800 recommended | "must" and "recommended" contradict (4) |
| src/app/seller/components/store/StoreAppearance.jsx | Video quality is low: Recommended 720p or higher. | hardcoded technical constraint in alert (2,5) |
| src/app/seller/components/store/StoreAppearance.jsx | Banner resolution must be at least 800×800 | wording differs from other upload hints (4) |
| src/app/seller/components/store/StoreFooter.jsx | Let shoppers follow you and helps us understand your brand better | grammar (4) |
| src/app/seller/components/store/StoreFooter.jsx | Quality you can trust | slogan placeholder, ad tone (5) |
| src/app/seller/components/store/StoreStory.jsx | More Than a Brand | promotional slogan placeholder (5) |
| src/app/seller/components/store/StoreStory.jsx | Founded, in Abuja, AKI Designs is where modesty meets bold style. Every piece is designed to tell a story - your story | stray comma, no full stop, ad tone (4,5) |
| src/app/seller/components/store/StoreStory.jsx | Minimum resolution is 800×800 | wording differs from the other upload hints (4) |
| src/app/seller/components/ForgotPasswordModal.jsx | Check your email for reset link | missing "the" (4) |
| src/app/seller/components/SuccessModal.jsx | You’re now part of Malltiply. Sign in to start selling and growing. | promise, ad tone (1,5) |
| src/app/seller/components/SuccessModal.jsx | AGS Logo | alt text names a different brand (4) |
| src/app/seller/normal/signup/page.jsx | Register to list and manage products on Malltiply. | promotional subheader (5) |
| src/app/seller/normal/dashboard/page.jsx | Dashboard will show your stats here | placeholder (1) |
| src/app/seller/normal/dashboard/page.jsx | Stats and analytics will be available in v1 | promise, "v1" is jargon (1) |
| src/app/seller/normal/dashboard/page.jsx | Store pages are available on the Premium plan. | explains Normal vs Premium, "plan" vs "seller" wording (3) |
| src/app/seller/normal/dashboard/page.jsx | View guides and common questions. | promise, but the Help Center page is a stub (1) |
| src/app/seller/normal/dashboard/products/form/page.jsx | {progress} / {total} required fields completed | numeric progress indicator (2) |
| src/app/seller/premium/dashboard/page.jsx | Stats and analytics will be available in v1 | same promise on premium (1) |
| src/app/seller/premium/signup/page.jsx | Premium sellers get branded store pages and priority curation. | explains Premium, "priority curation" unexplained (1,3,5) |
| src/app/seller/premium/signup/page.jsx | Confirm password required | grammar, missing "is" (4) |
| src/app/seller/premium/signup/page.jsx | Phone is required | inconsistent label: says "Phone" instead of "Phone Number" (4) |
| src/app/seller/premium/dashboard/store/page.jsx | Failed to save store. See console for details. | tells a seller to open the developer console (5) |
| src/app/seller/signin/page.jsx | Signin failed | "Signin" vs "Sign in" (4) |
| src/app/seller/signin/page.jsx | Password too short | does not say the minimum (5) |
| src/app/seller/signin/page.jsx | Want a branded store? | ad tone, hints at Normal vs Premium (3,5) |
| src/app/seller/signin/page.jsx | Apply as premium seller | missing article "a" (4) |





PART C 

 .../dashboard/PremiumNavbar.jsx}                   |   4 +-
 .../normal/dashboard/help/page.jsx => /dev/null    |   7 -
 .../{normal => premium}/dashboard/layout.jsx       |  11 +-
 .../seller/{normal => premium}/dashboard/page.jsx  |  32 +++--
 .../dashboard/payments/page.jsx => /dev/null       |   7 -
 .../dashboard/products/form/page.jsx               |  52 +++++++-
 .../dashboard/products/page.jsx                    |   5 +-
 .../app/seller/premium/dashboard/store/page.jsx    | 144 +++++++++++++++++++++
 8 files changed, 224 insertions(+), 38 deletions(-)

 
  .../dashboard/products/page.jsx                    | 38 ++++--
  .../dashboard/products/form/page.jsx               | 68 ++++++++----------
  .../seller/{normal => premium}/dashboard/page.jsx  | 43 ++++++--
  .../dashboard/PremiumNavbar.jsx => SellerNavbar.jsx | 38 +++-----
  .../dashboard/layout.jsx                           |  5 +-    
 5 files changed, 80 insertions(+), 116 deletions(-)

  src/app/seller/{normal => premium}/signup/page.jsx | 217 ++++++++++-----------
 1 file changed, 104 insertions(+), 113 deletions(-)

  src/app/seller/normal/signup/page.jsx => /dev/null |  11 -
 .../{normal => premium}/dashboard/layout.jsx       |   5 -
 .../seller/{normal => premium}/dashboard/page.jsx  |  41 +++++------
| src/app/seller/normal/dashboard/products/page.jsx | Normal sellers products page | /seller/normal/dashboard/products | useGetProductsQuery; useDispatch (setCurrentProduct, resetCurrentProduct); productSlice | none found |  |
 .../normal/signup/page.jsx => /dev/null           |  10 -
 .../premium/dashboard/PremiumNavbar.jsx => /dev/null | 16 -
| src/app/seller/premium/dashboard/products/page.jsx | Premium sellers products page | /seller/premium/dashboard/products | useGetProductsQuery; useDispatch (setCurrentProduct, resetCurrentProduct); productSlice | none found |  |
 7 files changed, 32 insertions(+), 83 deletions(-)




230 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\page.jsx
60 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\FaqDropdown.jsx
101 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\ForgotPasswordModal.jsx
160 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\MenuModal.jsx
69 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\SellerCategoryDropdown.jsx
66 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\SignupModal.jsx
28 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\SuccessModal.jsx
213 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\orders\AllOrders.jsx
197 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\orders\CancelledOrders.jsx
198 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\orders\DeliveredOrders.jsx
223 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\orders\OrderDetails.jsx
216 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\orders\PendingOrders.jsx
220 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\orders\ProcessingOrders.jsx
198 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\orders\ShippedOrders.jsx
296 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\products\MultiImageUpload.jsx
107 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\products\ProductBasicDetails.jsx
294 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\products\ProductFormFields.jsx
341 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\products\ProductVariantEditor.jsx
251 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\profile\ChangePasswordForm.jsx
73 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\profile\DeleteAccountButton.jsx
55 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\profile\NotificationToggle.jsx
157 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\profile\ProfileInfoForm.jsx
184 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\profile\ProfilePictureForm.jsx
155 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\AddCategoryModal.jsx
73 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\BrandTheme.jsx
81 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\CategoriesTabs.jsx
32 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\CategoryChip.jsx
164 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\ColorPickerModal.jsx
60 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\PreviewFooter.jsx
212 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\PreviewStore.jsx
77 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\PreviewStory.jsx
216 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\StoreAppearance.jsx
44 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\StoreCategories.jsx
133 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\StoreFooter.jsx
80 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\StoreHeader.jsx
185 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\components\store\StoreStory.jsx
20 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\layout.jsx
95 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\page.jsx
60 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\SellerNavbar.jsx
7 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\help\page.jsx
84 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\orders\page.jsx
7 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\payments\page.jsx
103 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\products\page.jsx
238 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\products\form\page.jsx
90 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\dashboard\settings\page.jsx
232 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\normal\signup\page.jsx
21 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\layout.jsx
107 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\page.jsx
60 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\PremiumNavbar.jsx
84 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\orders\page.jsx
104 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\products\page.jsx
280 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\products\form\page.jsx
90 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\settings\page.jsx
144 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\dashboard\store\page.jsx
223 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\premium\signup\page.jsx
85 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\privacy\page.jsx
166 C:\Users\salih\OneDrive\Desktop\malltiply\malltiply\src\app\seller\signin\page.jsx


[text](src/app/seller/components/products/MultiImageUpload.jsx) [text](src/app/seller/components/profile/DeleteAccountButton.jsx) [text](src/app/seller/components/store/StoreAppearance.jsx) [text](src/app/seller/components/store/StoreStory.jsx) [text](src/app/seller/normal/dashboard/settings/page.jsx) [text](src/app/seller/premium/dashboard/settings/page.jsx) [text](src/app/seller/premium/dashboard/store/page.jsx) [text](src/app/seller/premium/signup/page.jsx)





File                                        | Exact text                                        | What is wrong.
signin/page.jsx	| Want a branded store? Apply as premium seller	| sounds like advertising, and hints at Normal vs Premium
SellerCategoryDropdown.jsx	| Kid's Fashion	| apostrophe wrong, and it duplicates Kids Fashion
StoreFooter.jsx	| Let shoppers follow you and helps us understand your brand better	| grammar mistake
signin/page.jsx	| Welcome to the Seller Dashboard. Here you can manage your brand’s store, products, and orders. A simple, powerful way to sell with us. | Sounds like a standard welcome message.
StoreFooter.jsx	| Let shoppers follow you and helps us understand your brand better| grammatically incorrect. Should be: "Let shoppers follow you and help us understand your brand better."
store/page.jsx	| Let shoppers follow you and helps us understand your brand better | same error as above.
ProductForm.jsx	| You can only add one main image. The rest should be under additional images. | This is a limitation of the user's current plan, not a bug. They can upgrade to remove it.



PART D
1. what is the best and most efficient way you code while maintaining clarity and avoid bugs?
2. The category list is hardcoded with both Kids Fashion and Kid's Fashion. Where do valid categories come from?
3. How does a seller become premium? The sign-in page says “Apply as” and the pop-up says “Sign up as”.
4. What is the real payout model and timeline for sellers (wallet vs. direct bank transfer), and what should the empty Payments page show at launch?
5. For our initial launch, what should sellers see on their dashboard instead of the 'Stats will be available in v1' placeholder
6. Is fulfillment strictly Abuja-based with automated GIG courier pickups, or are sellers responsible for their own shipping?
7. Is there a size chart, and how do sellers indicate their product sizes? (This is currently missing from the form)