/**
 * Color Palette Define
 */

 let OrangeColor = {
    primaryColor: "#5B46F9",//"#E5634D",
    darkPrimaryColor: "#e08c0b",//"#C31C0D",
    lightPrimaryColor: "#ffc264",//"#FF8A65",
    accentColor: "#d23e3f",//"#4A90A4"
    secondaryColor : "#2fb2fb",
    lightSecondaryColor: "#6dc1f0"
  };
  
  let BlueColor = {
    primaryColor: "#5DADE2",
    darkPrimaryColor: "#1281ac",
    lightPrimaryColor: "#68c9ef",
    accentColor: "#FF8A65"
  };
  
  let PinkColor = {
    primaryColor: "#A569BD",
    darkPrimaryColor: "#C2185B",
    lightPrimaryColor: "#F8BBD0",
    accentColor: "#8BC34A"
  };
  
  let GreenColor = {
    primaryColor: "#58D68D",
    darkPrimaryColor: "#388E3C",
    lightPrimaryColor: "#C8E6C9",
    accentColor: "#607D8B"
  };
  
  let YellowColor = {
    primaryColor: "#FDC60A",
    darkPrimaryColor: "#FFA000",
    lightPrimaryColor: "#FFECB3",
    accentColor: "#795548"
  };
  
  /**
   * Main color use for whole application
   */
   let BaseColor = {
    ...OrangeColor,
    ...{
      textPrimaryColor: "#212121",
      textSecondaryColor: "#E0E0E1",
      grayColor: "#efeded",
      lightGrayColor:'#D0D0D0',
      darkGrayColor:'#9B9B9B',
      darkBlueColor: "#24253D",
      dividerColor: "#BDBDBD",
      blackColor: "#000000",
      whiteColor: "#FFFFFF",
      fieldColor: "#F5F5F5",
      fieldColorBlur:"#f5f5f5d9",
      yellowColor: "#FDC60A",
      navyBlue: "#3C5A99",
      lightBlue: "#2fb2fb",
      kashmir: "#5D6D7E",
      brownColor:"#5e3a33"
    }
  };
  
  export {
    BaseColor,
    OrangeColor,
    BlueColor,
    PinkColor,
    GreenColor,
    YellowColor
  };
  