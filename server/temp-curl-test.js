const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
(async ()=>{
  try{
    const form = new FormData();
    form.append('resumeId','test');
    form.append('resumeData', JSON.stringify({personal_info:{name:'Test'}}));
    form.append('removeBackground','true');
    form.append('image', fs.createReadStream('test.jpg'));
    const resp = await axios.put('http://localhost:3000/api/resumes/update', form, { headers: form.getHeaders() });
    console.log('status', resp.status, resp.data);
  }catch(e){
    if(e.response){
      console.log('resp status', e.response.status, e.response.data);
    }else{
      console.error('err', e.message);
    }
  }
})();