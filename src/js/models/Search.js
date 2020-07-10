import axios from 'axios';

export default class Search{
  constructor(query){
    this.query=query;
  }
  async getResults(){
    try {
      const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
        //https://api.edamam.com/api/food-database/parser?app_id=ca747d07&app_key=722fabaee32b8118f7b1cb2e32b137cf&ingr=${formData.get('name')}`
        //https://api.edamam.com/search

      this.result = res.data.recipes;

    }
    catch (error){
      alert(error);
    }
  }
  
}

// `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
