var eventBus = new Vue()

Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      requireo: true
    }
  },
  template: `
    <div class="product">
      <div class="product-image">
          <img :src="image" alt="" srcset="">
      </div>

      <div class="product-info">
          <h1>{{ title }} </h1>
          <p>{{ sale }}</p>
          <p>{{ description }}</p>
          <p v-if="inStock">In Stock</p>
          <p v-else :class="{ outOfStock: !inStock }">Out of Stock</p>
          <p>Shipping: {{ shipping }}
          
          <product-details :details="details"></product-details>

          <product-sizes  :sizes="sizes"></product-sizes>

          <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
              :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
          </div>
          <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
              Add to cart
          </button>
          <button @click="removeFromCart">Remove from cart</button>

          <product-tabs :reviews="reviews"></product-tabs>
          
          </div>      
    </div>
  `,
  data() {
    return {
      product: 'Socks',
      description: 'A pair of warm fuzzy socks',
      onSale: true,
      brand: 'Vue Mastery',
      selectedVariant: 0,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [{
          variantId: 2234,
          variantColor: 'green',
          variantImage: './assets/vmSocks-green-onWhite.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: './assets/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0
        }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      reviews: []
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index
    },
    removeFromCart() {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    sale() {
      return this.brand + ' ' + this.product + ` are ${this.onSale? 'on' : 'not'} sale!`;
    },
    shipping() {
      return this.premium ? "Free" : "2.99";
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview =>{
      this.reviews.push(productReview);
    })
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `
})

Vue.component('product-sizes', {
  props: {
    sizes: {
      type: Array,
      required: true
    }
  },
  template: `
    <ul>
      <li v-for="size in sizes">{{ size }}</li>
    </ul>
  `
})

Vue.component('product-review', {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
        
    <p class="error" v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors">{{ error }}</li>
      </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>Would you recommend this product?</p>
    <label>
      Yes
      <input type="radio" value="Yes" v-model="recommend"/>
    </label>
    <label>
      No
      <input type="radio" value="No" v-model="recommend"/>
    </label>
        
    <p>
      <input type="submit" value="Submit">  
    </p>    

  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: []
    }
  },
  methods: {    
    onSubmit() {
      this.errors = []
      if (this.isAllFieldFilled()) {
        eventBus.$emit('review-submitted', this.getProductReview())
        this.clearAllFields();
      } else {
        this.showEmptyFieldsToUser();
      }
    },

    isAllFieldFilled() {
      return this.name && this.review && this.rating && this.recommend;
    },

    getProductReview() {
      return {
        name: this.name,
        review: this.review,
        rating: this.rating,
        recommend: this.recommend
      };
    },

    clearAllFields() {
      this.name = null;
      this.review = null;
      this.rating = null;
      this.recommend = null;
    },

    showEmptyFieldsToUser(){
      if (!this.name) this.errors.push("Name required.")
      if (!this.review) this.errors.push("Review required.")
      if (!this.rating) this.errors.push("Rating required.")
      if (!this.recommend) this.errors.push("Recommendation required.")
    }
  }
})

Vue.component('product-tabs', {
  props: {
    reviews:{ type: Array, required: true}
  },
  template: `
    <div>
      <span class="tab" :class="{ activeTab: selectedTab === tab}" v-for="(tab, index) in tabs" @click="selectedTab = tab">
        {{ tab }}
      </span>

      <div v-show="selectedTab === 'Reviews'">
        <ul>
          <h2>Reviews</h2>
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>Rating: {{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
    
    
    
    <product-review v-show="selectedTab === 'Make a Review'"></product-review>
    </div>

   
  `,
  data(){
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews'
    }
  }
})
var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeFromCart(id) {
      this.cart = this.cart.filter(item => item != id);
    }

  }
})