function objectToFormData(data) {
  let form_data = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    form_data.append(key, value);
  });

  return form_data;
}

function request(
  url,
  token = false,
  data = false,
  method = "GET",
  formData = false
) {
  return new Promise(async (resolve, reject) => {

    const user = JSON.parse(localStorage.getItem("user"));
    const serviceToken = localStorage.getItem("serviceToken");

    let response, result;
    let options = {};
    

    if (!token) {
      options = {
        method,
        headers: {
          Accept: "application/form-data",
        },
      };
    } else {
      options = {
        method,
        headers: {
          Authorization: `Bearer ${token === false ? serviceToken : serviceToken}`,
          Accept: "application/form-data",
        },
      };
    }



    // if(data && method === "POST" && formData){

    // }

    // if (data && method === "POST") {
    //   options.body = formData ? objectToFormData(data) : JSON.stringify(data);
    // }

    if (data && method === "POST" && formData) {  
      options.body = formData ? data : JSON.stringify(data);
    }
    else if (data && method === "POST") {
      options.body = formData ? objectToFormData(data) : JSON.stringify(data);
    }

    if (data && method === "PUT") {
      options.body = formData ? objectToFormData(data) : JSON.stringify(data);
    }

    if (data && !formData && method === "POST") {
      options.headers["Content-Type"] = "application/json";
    }

    if (data && !formData && method === "PUT") {
      options.headers["Content-Type"] = "application/json";
    }

    try {
      response = await fetch(import.meta.env.VITE_APP_API_URL + url, options);
      if (response?.status === 401) {
        localStorage.removeItem('serviceToken')
        location.replace('/login')
      }
      result = await response.json();
    } catch (error) {
      if (response?.status === 404) {
        return reject("404");
      } else if (response?.status === 401) {
        localStorage.removeItem('serviceToken')
        location.replace('/login')
        return reject("Unauthorized");
      } else if (response?.status === 403) {
        return reject("Forbidden");
      } else if (response?.status >= 500) {
        // hata mail olarak gönderilecek
        return reject("Server Error");
      } else {
        return reject("Global Error = " + response?.status);
      }
    }

    if (response) {
      resolve(result);
    }
  });
}

export const post = (url, data, token = false, formData = false) => request(url, token, data, "POST", formData);
export const get = (url, token = false) => request(url, token);
export const remove = (url) => request(url, true, false, "DELETE");
export const put = (url, data, token = false, formData = false) => request(url, token, data, "PUT", formData);


