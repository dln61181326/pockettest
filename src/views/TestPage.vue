<template>
  <div>

          <div>
        <div class="photo">
            <div v-for="(img,index) in imgs" :key="index">
                <img class="upload-img" :src="img" alt />
            </div>
            <div class="default">
                <img src="../assets/allchoice.png"/>
                <input type="file" name="head_img" accept="image/*" @change="fileChange($event)" />
            </div>
        </div>
    </div>
  <!-- <div id="top" class="top">
    
    <img src="../assets/backpoint.png"class="cancelButton clearfix:after" @click="showErrorTips"/>
    <div class="okDiv clearfix:after"@click="summit()">
    <div  class="okButton"/>
     </div>
     <div id=""class="">
       <textarea maxlength="200" type="text"  placeholder="请填写...最多可输入100字" v-model="Comment" class="publishtext"></textarea>
     </div>
  </div>
  <div class="photoContent"> -->
    <!-- v-bind:src="require('../static/images/icon/home-on.png')" -->
    
    <!-- <div class="vue-uploader">
      <div class="file-list">
          <section v-for="(file, index) of files" class="file-item draggable-item">
              <img :src="file.src" alt="" ondragstart="return false;">
              <span class="file-remove" @click="remove(index)">+</span>
          </section>
          <section v-if="status == 'ready'" class="file-item">
              <div @click="add" class="add" v-if="files.length<9">
                  <span>+</span>
              </div>
          </section>
      </div>

      <input  name="head_img"type="file" id="uploadimg" accept="image/*" @change="fileChanged" ref="file" multiple="head_img">
  </div>
  </div>
 -->

<!-- 
  <div class="maskBoxblack TipsMask" v-if="errorTipsmask" @click="cancelmask">
      <span class="TipsBox maskBox">
          
       <div class="errorcontent" >{{this.$store.state.errormasktipscontent}}</div>
   
    </span>
  </div> -->
  
  <!-- <loadding v-if="loaddingdisplay"></loadding>   -->
  <!-- <ErrorTips   ref="ErrorTips" v-bind:class="[showErrordissplay ? showError : disshowError ]" ></ErrorTips>   -->
</div>


</template>

<script>
  import Router from "../router/index";
  import store from '../vuex/store';
//   import "../toolsjs/AuthHelper";
  import Vue from 'vue';
export default {
  components: {     //引用重复页面模块
            // loadding:require('./loadding.vue').default,
            // ErrorTips:require('./ErrorTips.vue').default 
        },  

        methods:{

             fileChange(e) {
                // 获取file文件
                const file = e.target.files[0];
                if (file.size / 1024 / 1024 > 5) {
                    alert("图片大于5M上传失败");
                    return;
                }
                // 通过FormData进行接口传输
                const formData = new FormData();
                formData.append("head_img", file);
                // 接口上传
                this.$axios.post("http://localhost:3001/api/user/upload",formData).then(response => {
                    if (response.code == 200) {
                        // 1、通过base64 预览
                        // let reader = new FileReader();
                        // reader.readAsDataURL(file);
                        // reader.onload = e => {
                        //     this.imgs.push(e.target.result);
                        // };
                        // 2、这里通过接口返回图片地址预览
                        // this.imgs.push("//localhost:3001" + response.data);
                    }
                });
            },
          okf: function(){
            //统一方法名，用于给ErrorTips调用
            this.showErrordissplay = false

            // this.summit()
             this.checkpicList();
          },
          summit :function(){
            // if(this.files.length>9){
            //   this.errorTipsmask  =true
            //     this.$store.state.errormasktipscontent = "图片最多只能上传9张"
            // }else if(this.Comment.length<1){
            //   this.errorTipsmask  =true
            //     this.$store.state.errormasktipscontent = "评论字数不能为空"
            // }else if(this.files.length<=0){
            //   this.errorTipsmask  =true
            //     this.$store.state.errormasktipscontent = "上传图片不能为空"
            // }
            // else if(this.Comment.length>800){
            //   this.errorTipsmask  =true
            //     this.$store.state.errormasktipscontent = "评论字数不能多于800个"
            // }else{
            //   this.SaveCommentM()
            this.checkpicList()
      

            // }
          },

          checkpicList(){
            // var gosummitPic = false;
            // for(var i = 0;i<this.files.length;i++){
            //   if( this.files[i].ID == null){
            //       gosummitPic = true
            //   }
            // }
            // if(gosummitPic){
               this.summitpic()
        //     }else{
        //       this.loaddingdisplay = false
        //            this.errorTipsmask  =true
        //            this.$store.state.errormasktipscontent = "保存成功"
        //            setTimeout(function(){Router.go(-1)},1000);

        //   }
        },
          SaveCommentM :function(){
            this.showstate = true;

            this.loaddingdisplay = true
            switch(this.modelindex){
                    case "1":
                    this.mould = "StoreQ"
                    break;
                    case "2":
                    this.mould = "FactoryQ"
                    break;
                    case "3":
                    this.mould = "ModelQurl"
                    break;
                    default:
                    alert('系统有问题，请联系管理员');
                    break;

                  };
                var data = {
                    "detailID":store.state.DetailID,
                    "module": this.mould,
                    "comment": this.Comment,
                    "userCode": store.state.userCode
                };

                //   var urlSuffixe = AuthHelper.GenerateSignature_PostData(data,store.state.userCode,store.state.token);
            $.ajax({
                type: 'post',
                url: this.indexUrl+'/api/Comment/SaveComment',
                data: urlSuffixe,
                dataType: "json"
              }).then((res)=>{
                    this.showstate = false;
                    this.loaddingdisplay = false
                 
                    if(res.StatusCode != 2000){
                      console.log("SaveCommenterr")
                      console.log("SaveCommenterr======="+res)
                      this.errorTipsmask  =true

                      this.$store.state.errormasktipscontent = "保存不成功"

                      
                    }else{
                      console.log("SaveComment======="+res)
                      this.checkpicList();
                    
                    }
                  },function (res) {
        //失败之后处理逻辑
        this.loaddingdisplay = false
                   this.showstate = false;
                   this.errorTipsmask  =true
                   this.$store.state.errormasktipscontent = "保存不成功"
                   console.log("err")
                   console.log("error:"+res)

      })
        },
          add() {
                this.$refs.file.click()//调用file的click事件
            },
            submitdemo() {
                if (this.files.length === 0) {
                    console.warn('no file!');
                    return
                }
                //当点击上传按钮时，将会遍历所有选中的文件，并添加到自定义的FormData中
                const formData = new FormData()
                this.files.forEach((item) => {
                    formData.append(item.name, item.file)
                })
                const xhr = new XMLHttpRequest()
                xhr.upload.addEventListener('progress', this.uploadProgress, false)
                xhr.open('POST', this.src, true)
                this.uploading = true
                xhr.send(formData)
                xhr.onload = () => {
                    this.uploading = false
                    if (xhr.status === 200 || xhr.status === 304) {
                        this.status = 'finished'
                        console.log('upload success!')
                    } else {
                        console.log(`error：error code ${xhr.status}`)
                    }
                }
            },
            finished() {
                this.files = []
                this.status = 'ready'
            },
            remove(index) {
              // var that = this

              // var a = this.files
              var Id = this.files[index].ID
              console.log("this.file[index].DetailID==============="+Id)
            //   if(Id==null||Id==""){
            //     this.files.splice(index, 1)
            // return
            //   }
                 //对比原来的数组中是否有此图片
              //    var fileExitState = true;
              // for(var i=0;i<this.tempfilelist.length;i++){
              //      if(Id==this.tempfilelist[i].ID){
              //        fileExitState = false
              //      }
              //    }
              if(Id==null||Id==""){
                this.files.splice(index, 1)
                    return
                
              }else{
                this.loadDelepick(index,Id)

              }
            },
            fileChanged() {
                const list = this.$refs.file.files
                var a  = this.tempimglist
                for (let i = 0; i < list.length; i++) {
                    if (!this.isContain(list[i])) {
                        const item = {
                            name: list[i].name,
                            size: list[i].size,
                            file: list[i]
                        }
                        this.html5Reader(list[i], item)
                        this.files.push(item)
                    }
                }
                this.$refs.file.value = ''
            },
            // 将图片文件转成BASE64格式
            html5Reader(file, item){
                const reader = new FileReader()
                reader.onload = (e) => {
                    this.$set(item, 'src', e.target.result)
                }
                reader.readAsDataURL(file)
            },
            isContain(file) {
              return this.files.find((item) => item.name === file.name && item.size === file.size)
            },
            uploadProgress(evt) {
                const component = this
                if (evt.lengthComputable) {
                    const percentComplete = Math.round((evt.loaded * 100) / evt.total)
                    component.percent = percentComplete / 100
                } else {
                    console.warn('upload progress unable to compute')
                }
            },
          chooseType() {
                document.getElementById('upload_file').click();
            },
          
          cancelmask :function(){
            this.errorTipsmask  = false
          },
          
          loadDelepick :function(fileindex,picId){
              this.loaddingdisplay = true

              var data = { id: picId };
            //   var urlSuffixe = AuthHelper.GenerateSignature_UrlSuffix(data,store.state.userCode,store.state.token);
              var url = this.indexUrl+"/api/Comment/DeleteImg/?id="+picId+"&"+urlSuffixe
              $.ajax({
              type: 'get',
            url:url,
            dataType: "json",
            }).then((res)=>{
                    this.showstate = false;
                    this.loaddingdisplay = false
                 
                    if(res.StatusCode != 2000){
                      console.log("err")
                    }else{
                      console.log("res===="+res)
                      this.files.splice(fileindex, 1)
                    }
                  },function (res) {
        //失败之后处理逻辑
                   this.showstate = false;
                   this.loaddingdisplay = false
                   console.log("err")
                   console.log("error:"+res)

      })
          },


   // 压缩图片 
   compress(img) { 
            let canvas = document.createElement("canvas"); 
            let ctx = canvas.getContext("2d"); 
            let initSize = img.size; 
            let width = img.width; 
            let height = img.height; 
            canvas.width = width; 
            canvas.height = height; 
            // 铺底色 
            ctx.fillStyle = "#fff"; 
            ctx.fillRect(0, 0, canvas.width, canvas.height); 
            ctx.drawImage(img, 0, 0, width, height); 
            //进行最小压缩 
            let ndata = canvas.toDataURL("image/jpeg", 0.1); 
            console.log("压缩后的图片大小：" + ndata.length); 
            console.log("压缩后的图片内容：" + ndata)
            return ndata; 
        }, 

        // base64转成bolb对象 
        dataURItoBlob(base64Data) { 
            var byteString; 
            if (base64Data.split(",")[0].indexOf("base64") >= 0) 
                byteString = atob(base64Data.split(",")[1]); 
            else 
                byteString = unescape(base64Data.split(",")[1]); 
            var mimeString = base64Data .split(",")[0] .split(":")[1] .split(";")[0]; 
            var ia = new Uint8Array(byteString.length); 
            for (var i = 0; i < byteString.length; i++) { 
                ia[i] = byteString.charCodeAt(i); 
            } 
            return new Blob([ia], { type: mimeString }); 
        },
      
          summitpic :function(){
            this.loaddingdisplay = true
            var formData = new FormData();
            var _this = this;
            
             var s = 0 
             console.log("files.length========"+s)
            for (var i = 0; i < this.files.length; i++) {
              //对比原来有的图片，没有才append进去
             //要判断一下是否太大才压缩
                   if( this.files[i].ID == null&& this.files[i].FileSize>307200){
                    // let data = this.compress(this.files[i].file);
                   
                    var imgfile =  this.files[i].file
                    console.log("压缩前图片长度================="+this.files[i].size)

                    lrz( this.files[i].file,{width: 600})  

            .then(function(rst) {

                s++
                console.log("压缩后图片长度================="+rst.fileLen)
                 formData.append("attachment", rst.origin)
                 if(i == s){

                    _this.PostPic(formData)
          
                 }
                

            }).catch(function(error) {

                //失败时执行

            })
                    
                  // formData.append("attachment", this.files[i].file);

                 }else if( this.files[i].ID == null){
                  formData.append("attachment", this.files[i].file)

                  if(i>=_this.files.length-1){

                    _this.PostPic(formData)
          
                    }
                 }
            }
            // console.log("==========noData===========");
            // var a = formData.get("attachment")
            //       if(a == undefined){
            //       this.errorTipsmask  =true
            //     this.loaddingdisplay = false
            //     this.$store.state.errormasktipscontent = "操作完成"
            //       return
            //       }
                // console.log("压缩后图片长度================="+rst.fileLen)
           
               
            
          
          },

          PostPic(picData){
            console.log("PostPic====================")
            var PostData = {
                // detailID:store.state.DetailID,
                module: this.mould
            };
        //    var urlSuffixe = AuthHelper.GenerateSignature_UrlSuffix(PostData,store.state.userCode,store.state.token);
        //    var url = this.indexUrl+"/api/Comment/UploadImg?detailID="+store.state.DetailID+"&module="+this.mould+"&"+urlSuffixe;
                let url = `http://localhost:3001/api/user/upload`
                
            $.ajax({
              type: 'post',
              data:picData,
              url:url,
              processData: false,
              contentType: false,
            }).then((res)=>{
            console.log(res.Message);
            this.errorTipsmask  =true
            this.loaddingdisplay = false
              if(res.StatusCode  == "2000"){
                this.$store.state.errormasktipscontent = "保存成功"
                setTimeout(function(){Router.go(-1)},1000);
              }else{
                this.$store.state.errormasktipscontent = "保存不成功，请重试"
               
              }
            }),function (res) {
             //失败之后处理逻辑
                   this.showstate = false;
                   this.loaddingdisplay = false
                   console.log("err")
                   console.log("error:"+res)

      }
          },
          getData :function(){
          // console.log("detailID====publish======"+this.$store.DetailID);
          // this.datashowstate = false
          var that = this; 
          
          that.showstate = true;
          this.loaddingdisplay = true
                  var url = "";

                  var data = { detailID:  this.$store.state.DetailID };
            //   var urlSuffixe = AuthHelper.GenerateSignature_UrlSuffix(data,store.state.userCode,store.state.token);
            //   url = that.indexUrl+"/api/Comment/GetCommentAndImages?detailID="+this.$store.state.DetailID+"&"+urlSuffixe

                  console.log("GetCommentAndImages================="+url)
                  $.ajax({
              type: 'get',
            url:url,
            dataType: "json",
            }).then((res)=>{
                    that.showstate = false;
                    this.loaddingdisplay = false
                 
                    if(res.StatusCode != 2000){
                      console.log("err")
                    }else{
                       if(res!=undefined&&res!=""){
                        that.Comment = res.Comment
                        if( res.imgList!=undefined&&res.imgList.length>0){
                          that.files = res.imgList
                          that.tempimglist = res.imgList

                          // 模拟多个数据
                          for (const i in that.files) {
                            // that.imgarr[i].ID = 
                            var imgdata = { id:res.imgList[i].ID };
                        //  var urlSuffixe = AuthHelper.GenerateSignature_UrlSuffix(imgdata, store.state.userCode, store.state.token);

                         that.files[i].src = this.$store.state.indexTestUrl+"/api/Comment/DownloadThumbnail?id="+this.files[i].ID+"&" + urlSuffixe
                        //  that.files[i].name = this.files[i].FilenName   
                         console.log(" this.files[i].ID============"+this.files[i].src);
                              // this.getImgCodeApi(this,this.imgarr[i].ID)
                              
                          }
                        }
                       }
                    }
                  },function (res) {
        //失败之后处理逻辑
                   this.showstate = false;
                   this.loaddingdisplay = false
                   console.log("err")
                   console.log("error:"+res)

      })
                },
     

          toproject:function() {
                Router.push({name:'SupplierList'}) 
       },

       disshowErrorTipsDiv: function(){//统一方法名，用于给ErrorTips调用
              this.showErrordissplay = false
            },
       showErrorTips:function(){
         this.showErrordissplay = true;
        this.$refs.ErrorTips.showTips("将此次编辑保留？","取消","保留","不保留",true);
        
       },



       
        },
  data () {
    return {
      Comment:"",
      // errorTipscontent:store.state.errormasktipscontent,
      srcbase64:[],
      SaveComments:false,
      errorTipsmask:false,
      modelindex:store.state.modelindex,
      showErrordissplay:false,
      dataList:{},
      showLoadding:"showLoadding",
      disshowloadding:"disshowloadding",
      loaddingdisplay:false,
      disshowError:"disshowloadding",
      showError:"showLoadding",
      indexUrl:store.state.indexTestUrl,
      tempimglist:[],
      imgList: [],
      size: 0,
      mould:"",
      limit:6, //限制图片上传的数量
      tempImgs:[],
       status: 'ready',
                files: [],
                uploading: false,
                percent: 0
    }
  },
  mounted:function(){
        //   this.getData()
         
          
           
      },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .publishtext{
    background: #fafafa;
    border: none;
    width: 85%;
    margin: auto 1.1rem;
    height: 7rem;
    font-size: 1.2rem;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  .cancelButton{
    width: 1.5rem;
    float: left;
    margin: 1rem;
  }
  .okButton{
    height: 0.8rem;
    padding-top: 0.7rem;
    /* background: url("../assets/ok.png") center center no-repeat; */
    background-size: 1.4rem auto;
  }
  .okDiv{
    float: right;
    background: #009e96;
    width: 3rem;
    height: 1.6rem;
    margin: 0.7rem;
    border-radius: 0.4rem;
  }
  .showLoadding{
    display:inline;
  }
  .disshowloadding{
    display: none;
  }

  .top{
    width: 100%;
    position: absolute;
    margin: 0;
    height: 100%;
    left: 0;
    top: 0;
  }

  .photoContent{
    padding-top: 10rem;
    padding-left: 0.5rem;
  }

  .photoarr{
    width: 29%;
    margin: 3% 2%;
    height: 5rem;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    float: left;
  }
  .addIcon{
    width: 2.7rem;
    float: left;
    margin: 1rem;
    border: 1px solid #9d9d9d;
    padding: 0.8rem;
  }

  .errorcontent{
    color: #fff;
    
  }

  /*弹框*/
.maskBoxblack{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100%;
    background-color: rgba(0,0,0,0.8);
    z-index: 99999;
    text-align: center;
}
.maskBox{
  margin: 17rem auto;
    display: inline-block;
    line-height: 0.6rem;
    vertical-align: middle;
    width: 80%;
    text-align: center;
}
.clearfix:after {
  content: "020";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

  .clearfix:after {
  content: "020";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.clearfix {
  /* 触发 hasLayout */
  zoom: 1;
}

.vue-uploader {
    /* border: 1px solid #e5e5e5; */
}
.vue-uploader .file-list {
    padding: 10px 0px;
}
.vue-uploader .file-list:after {
    content: '';
    display: block;
    clear: both;
    visibility: hidden;
    line-height: 0;
    height: 0;
    font-size: 0;
}
.vue-uploader .file-list .file-item {
    float: left;
    position: relative;
    width: 100px;
    text-align: center;
}
.vue-uploader .file-list .file-item img{
    width: 5rem;
    margin-top: 1rem;
    height: 5rem;
    border: 1px solid #ececec;
}
.vue-uploader .file-list .file-item .file-remove {
    position: absolute;
    right: 12px;
    display: none;
    top: 4px;
    width: 14px;
    height: 14px;
    color: white;
    cursor: pointer;
    line-height: 12px;
    border-radius: 100%;
    transform: rotate(45deg);
    background: rgba(0, 0, 0, 0.5);
}
.vue-uploader .file-list .file-item:hover .file-remove {
    display: inline;
}
.vue-uploader .file-list .file-item .file-name {
    margin: 0;
    height: 40px;
    word-break: break-all;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.vue-uploader .add {
    width: 5rem;
    height: 5rem;
    margin-left: 0.5rem;
    float: left;
    text-align: center;
    line-height: 5rem;
    margin-top: 1rem;
    border: 1px dashed #ececec;
    font-size: 2rem;
    cursor: pointer;
}
.vue-uploader .upload-func {
    display: flex;
    padding: 10px;
    margin: 0px;
    background: #f8f8f8;
    border-top: 1px solid #ececec;
}
.vue-uploader .upload-func .progress-bar {
    flex-grow: 1;
}
.vue-uploader .upload-func .progress-bar section {
    margin-top: 5px;
    background: #00b4aa;
    border-radius: 3px;
    text-align: center; 
    color: #fff;
    font-size: 12px;
    transition: all .5s ease;
}
.vue-uploader .upload-func .operation-box {
    flex-grow: 0;
    padding-left: 10px;
}
.vue-uploader .upload-func .operation-box button {
    padding: 4px 12px;
    color: #fff;
    background: #007ACC;
    border: none;
    border-radius: 2px;
    cursor: pointer;
}
.vue-uploader > input[type="file"] {
    display: none;
}
</style>
