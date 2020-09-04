<template>

    <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

/*弹框*/
.maskBoxblack{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    background-color: rgba(0, 0, 0, 0.63);
    z-index: 99999;
    text-align: center;
}
.maskBox{
    color: #fff;
    background-color: rgba(0,0,0,0.8); 
    font-size: 2.4rem;
    display: inline-block;
    line-height: 0.6rem;
    vertical-align: middle;
    width: 80%;
    text-align: center;
}

.spinner {
    /* margin: 0% auto; */
    width: 50px;
    height: 60px;
    text-align: center;
    font-size: 10px;
    position: absolute;
    top: 40%;
    left: 46%;
}

.spinner > div {
    background-color: #FFBD2F;
    height: 100%;
    width: 6px;
    display: inline-block;

    -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
    animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.spinner .rect3 {
    -webkit-animation-delay: -1.0s;
    animation-delay: -1.0s;
}

.spinner .rect4 {
    -webkit-animation-delay: -0.9s;
    animation-delay: -0.9s;
}

.spinner .rect5 {
    -webkit-animation-delay: -0.8s;
    animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
    0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
    20% { -webkit-transform: scaleY(1.0) }
}

@keyframes stretchdelay {
    0%, 40%, 100% {
        transform: scaleY(0.4);
        -webkit-transform: scaleY(0.4);
    }  20% {
           transform: scaleY(1.0);
           -webkit-transform: scaleY(1.0);
       }
}
</style>
