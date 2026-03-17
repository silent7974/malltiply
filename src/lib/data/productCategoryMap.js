const productCategoryMap = {
  "Men's Fashion": {
    categories: {
      "Shoes": ["Palms", "Loafers", "Sneakers", "Sandals"],
      "Native": ["Agbada", "Kaftan", "Senator"],
      "Shirts": ["Casual Shirt", "Dress Shirt", "Polo Shirt"],
      "Trousers": ["Jeans", "Chinos", "Formal Pants"],
      "Jackets": ["Blazers", "Leather Jackets", "Winter Coats"]
    },
    variants: {
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      categorySizes: {
        "Shoes": ["39", "40", "41", "42", "43", "44", "45", "46"]
      },
      colors: true
    }
  },

  "Women's Fashion": {
    categories: {
      "Native": ["Boubou", "Kaftan", "Ankara Gown"],
      "Dresses": ["Maxi Dress", "Midi Dress", "Mini Dress"],
      "Tops": ["Blouse", "Tank Top", "Crop Top"],
      "Skirts": ["Maxi Skirt", "Midi Skirt", "Mini Skirt"],
      "Shoes": ["Heels", "Flats", "Sneakers"]
    },
    variants: {
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      colors: true
    }
  },

  "Unisex Fashion": {
    categories: {
      "T-shirts": ["Plain Tee", "Graphic Tee"],
      "Hoodies": ["Pullover Hoodie", "Zip Hoodie"]
    },
    variants: {
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      categorySizes: {
        "Shoes": ["39", "40", "41", "42", "43", "44", "45", "46"]
      },
      colors: true
    }
  },

  "Fabrics & Materials": {
    categories: {
      "Ankara": ["Plain Ankara", "Pattern Ankara"],
      "Lace": ["Swiss Lace", "Cord Lace"]
    },
    variants: {
      measurement: "yards", // replaces size
      colors: true
    }
  },

  "Accessories": {
    categories: {
      "Bags": ["Handbag", "Backpack"],
      "Jewelry": ["Necklace", "Bracelet", "Earrings", "Wristwatch"],
      "Glasses": ["Photochromic", "shades", "magnificated"]
    },
    variants: {
      colors: true
    }
  },

  // "Beauty & Personal Care": {
  //   categories: {
  //     "Makeup": ["Foundation", "Lipstick", "Mascara"],
  //     "Skincare": ["Moisturizer", "Sunscreen", "Face Serum"]
  //   },
  //   variants: {}
  // },  // "Kids Fashion": {
  //   categories: {
  //     "Boys Wear": ["Shirts", "Shorts"],
  //     "Girls Wear": ["Dresses", "Skirts"]
  //   },
  //   variants: {
  //     sizes: ["2-3 years", "4-5 years", "6-7 years", "8-9 years", "10-12 years"],
  //     colors: true
  //   }
  // },

  // "Home & Lifestyle": {
  //   categories: {
  //     "Furniture": ["Chair", "Table", "Bed"],
  //     "Decor": ["Wall Art", "Rugs"]
  //   },
  //   variants: {}
  // },

  // "Gift Shops": {
  //   categories: {
  //     "Gift Hampers": ["Birthday", "Wedding"],
  //     "Custom Items": ["Engraved Mug", "Photo Frame"]
  //   },
  //   variants: {}
  // },



  // "Art & Custom Crafts": {
  //   categories: {
  //     "Paintings": ["Canvas", "Oil Painting"],
  //     "Sculptures": ["Wood", "Metal"]
  //   },
  //   variants: {}
  // },

  // "Baby & Maternity": {
  //   categories: {
  //     "Baby Clothing": ["Bodysuit", "Rompers"],
  //     "Maternity Wear": ["Maternity Dress", "Maternity Tops"]
  //   },
  //   variants: {
  //     sizes: [
  //       "0-3 months", "3-6 months", "6-12 months",
  //       "1-2 years", "2-3 years"
  //     ],
  //     colors: true
  //   }
  // }
}

export default productCategoryMap