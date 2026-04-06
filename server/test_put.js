const axios = require('axios');

async function test() {
  try {
    const res = await axios.put('http://localhost:10000/api/users/profile/1', {
      full_name: 'Test Name',
      phone: '0123456789'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log("Success:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error message:", err.response.data);
    } else {
      console.log("Error:", err.message);
    }
  }
}
test();
