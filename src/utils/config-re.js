const re = {
  phone: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
  pwd: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,.]).{8,16}$/,
  email: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  bank: /^([1-9]{1})(\d{14}|\d{18})$/,
  code: /^\w{6}$/,
  video: /mp4|rmvb|flv|%/i,
  img: /jpg|jpeg|gif|png|%/i,
  pdf: /pdf|%/i,
  url: /(http|https):\/\/([\w.]+\/?)\S*/,
  docF: /txt|doc|docx|xls|ppt|pptx|xlsx|pdf|htl|html|%/i,
  imgF: /jpg|jpeg|svg|raw|bmp|png|gif|tif|tiff|swf|dwg|dwf|dwt|eps|mif|miff|wmf|dib|ico|tga|cut|pic|%/i,
  audioF: /mp3|aac|wav|wma|cda|flac|m4a|mid|mka|mp2|mpa|mpc|ape|ofr|ogg|ra|wv|tta|ac3|dts|%/i,
  videoF: /avi|asf|wmv|avs|flv|mkv|mov|3gp|mp4|mpg|mpeg|dat|ogm|vob|rm|rmvb|ts|tp|ifo|nsv|%/i
}

export { re }
