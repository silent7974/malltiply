| File | What it does | Where it is used | Calls (API / Redux) | Problems seen | Status |
|---|---|---|---|---|---|
| src/app/seller/page.jsx | Landing page for seller center with basic information | /seller | none found | none found |  |
| src/app/seller/components/FaqDropdown.jsx | FAQ section for sellers | src/app/seller/page.jsx | none found | Hardcoded FAQ questions & answers array (faqData) |  |
| src/app/seller/components/ForgotPasswordModal.jsx | Modal for resetting password | src/app/seller/signin/page.jsx | useForgotPasswordMutation | none found |  |
| src/app/seller/components/MenuModal.jsx | Menu modal for seller dashboard | src/app/seller/normal/dashboard/SellerNavbar.jsx; src/app/seller/premium/dashboard/PremiumNavbar.jsx | useLogoutMutation; useSelector; useDispatch (sellerApi.util.resetApiState(, resetProfile(); sellerProfileSlice | none found |  |
| src/app/seller/components/SellerCategoryDropdown.jsx | Dropdown for selecting seller categories | src/app/seller/components/profile/ProfileInfoForm.jsx; src/app/seller/normal/signup/page.jsx; src/app/seller/premium/signup/page.jsx | none found | none found |  |
| src/app/seller/components/SignupModal.jsx | Signup modal for sellers | src/app/seller/page.jsx | none found | none found |  |
| src/app/seller/components/SuccessModal.jsx | Shows success message after signup | src/app/seller/normal/signup/page.jsx; src/app/seller/premium/signup/page.jsx | none found | none found |  |
| src/app/seller/components/orders/AllOrders.jsx | calculation of the sum of all orders in checkout page | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery, useGetProfileQuery | Hardcoded date filter options array (FILTERS) |  |
| src/app/seller/components/orders/CancelledOrders.jsx | what will happen when an order is cancelled | src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery | Hardcoded date filter options array (FILTERS) |  |
| src/app/seller/components/orders/DeliveredOrders.jsx | it tracks order before and after it is delivered | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery | Hardcoded date filter options array (FILTERS) |  |
| src/app/seller/components/orders/OrderDetails.jsx | details needed to be known by the seller about the order for updating order status. | src/app/orders/page.jsx; src/app/seller/components/orders/AllOrders.jsx; src/app/seller/components/orders/CancelledOrders.jsx; src/app/seller/components/orders/DeliveredOrders.jsx; src/app/seller/components/orders/PendingOrders.jsx (+2 more) | none found | none found |  |
| src/app/seller/components/orders/PendingOrders.jsx | showing pending orders and it's details | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery, useUpdateOrderStatusMutation | Hardcoded date filter options array (FILTERS) |  |
| src/app/seller/components/orders/ProcessingOrders.jsx | showing processing orders and it's details before it is shipped | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery, useUpdateOrderStatusMutation | Hardcoded date filter options array (FILTERS) |  |
| src/app/seller/components/orders/ShippedOrders.jsx | showing shipped orders and it's details before it is delivered | src/app/orders/page.jsx; src/app/seller/normal/dashboard/orders/page.jsx; src/app/seller/premium/dashboard/orders/page.jsx | useGetOrdersQuery | Hardcoded date filter options array (FILTERS); Track Shipment button has no onClick handler (L181) |  |
| src/app/seller/components/products/MultiImageUpload.jsx | uploads images for the products and a video and renderring video and images in the frontend. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | 5 alert(); Big commented-out code (L203-211, L224-279); Hardcoded 50MB video / 5MB image limits |  |
| src/app/seller/components/products/ProductBasicDetails.jsx | generate SKU which i think is the details of the product that are going to be shown in the frontend like name, color, size etc. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | none found |  |
| src/app/seller/components/products/ProductFormFields.jsx | custom color selector for products when uploading. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | Hardcoded color palette array (colors) |  |
| src/app/seller/components/products/ProductVariantEditor.jsx | used for editing the variants of the products which is products name, color, sizes, measurement, quantity and price. | src/app/seller/normal/dashboard/products/form/page.jsx; src/app/seller/premium/dashboard/products/form/page.jsx | none found | Hardcoded color palette array (colors) |  |
| src/app/seller/components/profile/ChangePasswordForm.jsx | used for changing the password of the user. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | axios (axios.put("/api/seller/profile") | Hardcoded password length rule (< 8); Direct axios call instead of RTK Query |  |
| src/app/seller/components/profile/DeleteAccountButton.jsx | used for deleting the account of the user. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useDeleteAccountMutation; useSelector; useDispatch (unused) | 1 alert() at L22; useDispatch initialized but unused |  |
| src/app/seller/components/profile/NotificationToggle.jsx | enabling and disabling of notifications from malltiply | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useUpdateProfileMutation; useSelector; useDispatch (toggleNotification(); sellerProfileSlice | 1 console.log at L22 |  |
| src/app/seller/components/profile/ProfileInfoForm.jsx | where user fill in the info needeed to identify them and save their log.. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useGetProfileQuery; useSelector | none found |  |
| src/app/seller/components/profile/ProfilePictureForm.jsx | uploading and deleting profile picture for users. | src/app/seller/normal/dashboard/settings/page.jsx; src/app/seller/premium/dashboard/settings/page.jsx | useSelector; useDispatch (setProfile({ profileImage: objectUrl }, deleteProfilePicture(); sellerProfileSlice | Commented-out code (L79-92, 14 lines) |  |
| src/app/seller/components/store/AddCategoryModal.jsx | used for adding a category to the store. | src/app/seller/components/store/StoreCategories.jsx | useGetProductsQuery; useSelector; useDispatch (setStoreCategories({ suggested: [], fromProducts: selected, }); storeSlice | none found |  |
| src/app/seller/components/store/BrandTheme.jsx | used for applying theme to the store. | src/app/seller/premium/dashboard/store/page.jsx | useSelector; useDispatch (setBrandColor(color); storeSlice | none found |  |
| src/app/seller/components/store/CategoriesTabs.jsx |  | src/app/seller/components/store/PreviewStore.jsx | useGetProductsByStoreQuery; useSelector | Category tab buttons have no onClick filter handler (L45) |  |
| src/app/seller/components/store/CategoryChip.jsx | used for displaying the categories of the store. | src/app/seller/components/store/AddCategoryModal.jsx | none found | none found |  |
| src/app/seller/components/store/ColorPickerModal.jsx |  | src/app/seller/components/store/BrandTheme.jsx | useSelector; useDispatch (setBrandColor(color); storeSlice | none found |  |
| src/app/seller/components/store/PreviewFooter.jsx | used for displaying the footer of the store. | src/app/seller/components/store/PreviewStore.jsx | useGetMyStoreQuery; useSelector | Hardcoded social icons configuration array |  |
| src/app/seller/components/store/PreviewStore.jsx | preview store for premium users to see how their store looks | src/app/seller/components/store/StoreHeader.jsx | useGetMyStoreQuery; useSelector | none found |  |
| src/app/seller/components/store/PreviewStory.jsx | used for previewing the stories of the store | src/app/seller/components/store/PreviewStore.jsx | useSelector | none found |  |
| src/app/seller/components/store/StoreAppearance.jsx | used for displaying the appearance of the store | src/app/seller/premium/dashboard/store/page.jsx | useSelector; useDispatch (setVideo({ previewUrl }, setBanner({ previewUrl }, toggleVideoMute(...); storeSlice | 4 alert() (L54, L59, L62, L72); Hardcoded 50MB video / 5MB banner limits |  |
| src/app/seller/components/store/StoreCategories.jsx |  | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | none found | none found |  |
| src/app/seller/components/store/StoreFooter.jsx |  | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | useSelector; useDispatch (setStoreTagline(e.target.value, setSocial({ platform: "instagram", value: e.target.value, }, setSocial({ platform: "tiktok", value: e.target.value, }...); storeSlice | none found |  |
| src/app/seller/components/store/StoreHeader.jsx | used for displaying the header of the store | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | useGetMyStoreQuery | none found |  |
| src/app/seller/components/store/StoreStory.jsx | used for displaying the stories of the store | src/app/seller/premium/dashboard/store/page.jsx; src/app/stores/[slug]/page.jsx | fetch (Cloudinary upload); useSelector; useDispatch (addStoryImage(res.secure_url, setStoryHeadline(e.target.value, setStoryDescription(e.target.value...); storeSlice | 1 alert() at L43 |  |
| src/app/seller/normal/dashboard/layout.jsx | Layout for normal sellers dashboard | /seller/normal/dashboard | useGetProfileQuery | none found |  |
| src/app/seller/normal/dashboard/page.jsx | Normal sellers dashboard | /seller/normal/dashboard | none found | none found |  |
| src/app/seller/normal/dashboard/SellerNavbar.jsx | Navigation bar for normal sellers | src/app/seller/normal/dashboard/layout.jsx | useSelector | none found |  |
| src/app/seller/normal/dashboard/help/page.jsx | Normal sellers help page | /seller/normal/dashboard/help | none found | Half-finished (6-line stub page with no content) |  |
| src/app/seller/normal/dashboard/orders/page.jsx | Normal sellers orders page | /seller/normal/dashboard/orders | none found | Action button has no onClick handler (L45) |  |
| src/app/seller/normal/dashboard/payments/page.jsx | Normal sellers payments page | /seller/normal/dashboard/payments | none found | Half-finished (6-line stub page with no content) |  |
| src/app/seller/normal/dashboard/products/page.jsx | Normal sellers products page | /seller/normal/dashboard/products | useGetProductsQuery; useDispatch (setCurrentProduct, resetCurrentProduct); productSlice | none found |  |
| src/app/seller/normal/dashboard/products/form/page.jsx | Normal sellers products form | /seller/normal/dashboard/products/form | useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation; fetch (Cloudinary upload); useSelector; useDispatch (resetCurrentProduct(); productSlice | 2 console.log (L131, L144) |  |
| src/app/seller/normal/dashboard/settings/page.jsx | Normal sellers settings page | /seller/normal/dashboard/settings | useUpdateProfileMutation; fetch (Cloudinary upload); useSelector; useDispatch (unused) | 1 alert() at L64; 1 console.log at L63; useDispatch imported but unused |  |
| src/app/seller/normal/signup/page.jsx | Normal sellers signup page | /seller/normal/signup | useSignupMutation | 1 console.log at L88; Hardcoded password length rule (>= 8) |  |
| src/app/seller/premium/dashboard/layout.jsx | Layout for premium sellers dashboard | /seller/premium/dashboard | useGetProfileQuery | none found |  |
| src/app/seller/premium/dashboard/page.jsx | Premium sellers dashboard | /seller/premium/dashboard | none found | Half-finished (links to non-existent /seller/premium/dashboard/help) |  |
| src/app/seller/premium/dashboard/PremiumNavbar.jsx | Navigation bar for premium sellers | src/app/seller/premium/dashboard/layout.jsx | useSelector | none found |  |
| src/app/seller/premium/dashboard/orders/page.jsx | Premium sellers orders page | /seller/premium/dashboard/orders | none found | Action button has no onClick handler (L45) |  |
| src/app/seller/premium/dashboard/products/page.jsx | Premium sellers products page | /seller/premium/dashboard/products | useGetProductsQuery; useDispatch (setCurrentProduct, resetCurrentProduct); productSlice | none found |  |
| src/app/seller/premium/dashboard/products/form/page.jsx | Premium sellers products form | /seller/premium/dashboard/products/form | useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation; fetch (Cloudinary upload); useSelector; useDispatch (resetCurrentProduct(); productSlice | 2 console.log (L147, L160) |  |
| src/app/seller/premium/dashboard/settings/page.jsx | Premium sellers settings page | /seller/premium/dashboard/settings | useUpdateProfileMutation; fetch (Cloudinary upload); useSelector; useDispatch (unused) | 1 alert() at L64; 1 console.log at L63; useDispatch imported but unused |  |
| src/app/seller/premium/dashboard/store/page.jsx | Premium sellers store page | /seller/premium/dashboard/store | useUpdateMyStoreMutation, useGetMyStoreQuery; fetch (Cloudinary upload); useSelector; useDispatch (hydrateFromStore(store); storeSlice | 2 alert() (L72, L75); 1 console.log at L74 |  |
| src/app/seller/premium/signup/page.jsx | Premium sellers signup page | /seller/premium/signup | useSignupMutation | 1 alert() at L84; 1 console.log at L83 |  |
| src/app/seller/privacy/page.jsx | Privacy page for sellers | /seller/privacy | none found | none found |  |
| src/app/seller/signin/page.jsx | Signin page for sellers | /seller/signin | useSigninMutation; useDispatch (sellerApi.endpoints.getProfile.initiate() | Hardcoded password length rule (< 8) |  |


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


