import accounting from 'accounting';


export default Formatter = {

  /*
  * formatting money
  * it's need accounting npm package
  */
  currency: (value)=>{
    if (value === 0)
        return 0;
    else if (value < 0) //accounting format when number is negative
        return "(" + accounting.formatMoney(value * -1, "", 0, ".", ",") + ")";
    else if (value)
        return accounting.formatMoney(value, "", 0, ".", ",");
  }

};
