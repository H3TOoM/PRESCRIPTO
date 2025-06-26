const path = require('path');
const fs = require('fs');
const axios = require('axios');
const doctors = require('../assets/doctorsData.cjs');

const API_URL = 'https://authappapi.runasp.net/api/doctors';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiaGF0aW1yYWdhYjEyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJmNmI4ZGZhZi04M2NmLTRkM2UtYTc2OC1lYTAxNzg3YzdlYmYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxZjJkNmQ4OThlQGVtYWlseS5wcm8iLCJGaXJzdE5hbWUiOiJoYXRpbSIsIkxhc3ROYW1lIjoicmFnYWIiLCJGdWxsTmFtZSI6ImhhdGltIHJhZ2FiIiwiR2VuZGVyIjoiTWFsZSIsIlJvbGUiOiJBZG1pbiIsIkFkZHJlc3MiOiIiLCJQaG9uZU51bWJlciI6IiIsIkRhdGVPZkJpcnRoIjoiIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJleHAiOjE3NTA5MTcxNDMsImlzcyI6IlJlYWxXb3JkQVBJIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NTA1MiJ9.zi-0e0XNLEserh_-Xu60_Xr4uEo9Wir2BIhczj2Zl64';

async function pushDoctors() {
  for (const doc of doctors) {
    try {
      // استخدام الصورة الافتراضية بدلاً من رفع الصورة
      const defaultImageUrl = 'https://authappapi.runasp.net/profile-pictures/defaults/default-picture-profile.png';

      const doctorData = {
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        phone: doc.phone,
        speciality: doc.speciality,
        degree: doc.degree,
        experience: doc.experience,
        about: doc.about,
        fees: doc.fees,
        isAvailable: doc.isAvailable,
        image: defaultImageUrl
      };

      const response = await axios.post(API_URL, doctorData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN
        }
      });

      console.log(`upload data successful ${doc.firstName} ${doc.lastName} بنجاح:`, response.data);
    } catch (error) {
      if (error.response) {
        console.error(`error at upload data  ${doc.firstName} ${doc.lastName}:`, error.response.data, {
          status: error.response.status
        });
      } else {
        console.error(`error at upload data  ${doc.firstName} ${doc.lastName}:`, error.message);
      }
    }
  }
}

pushDoctors();
