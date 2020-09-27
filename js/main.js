

Vue.component('product',{
  props: { 
    premium:{ type: Boolean, requireo: true}
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
                <ul>
                    <li v-for="detail in details">{{ detail }}</li>
                </ul>

                <ul>
                    <li v-for="size in sizes">{{ size }}</li>
                </ul>


                <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
                </div>
                <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
                    Add to cart
                </button>
                <button @click="removeFromCart">Remove from cart</button>


                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>
            </div>

        </div>
  `,
  data(){
    return {
      product: 'Socks',
      description: 'A pair of warm fuzzy socks',
      onSale: true,
      brand: 'Vue Mastery',
      selectedVariant: 0,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
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
      cart: 0,
    }
  },
    methods: {
      addToCart() {
        this.cart += 1
      },
      updateProduct(index) {
        this.selectedVariant = index
      },
      removeFromCart() {
        this.cart = this.cart > 0 ? this.cart - 1 : 0;
      }
    }
    ,
      computed: {
          title() {
              return this.brand + ' ' + this.product  
          },
          image(){
              return this.variants[this.selectedVariant].variantImage
          },
          inStock(){
              return this.variants[this.selectedVariant].variantQuantity
          },
          sale() {
            return this.brand + ' ' + this.product + ` are ${this.onSale? 'on' : 'not'} sale!`;
          },
          shipping(){
            return this.premium ? "Free" : "2.99";
          }
      }
})


var app = new Vue({
  el: '#app',
  data: {
    premium: true
  }
})