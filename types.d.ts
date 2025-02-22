interface AuthCredentials {
    fullName: string;
    email: string;
    password: string;
  }

interface jobSearchResult 
  {
    "type": "object",
    "properties": {
      "status": {
        "type": "string"
      },
      "request_id": {
        "type": "string"
      },
      "parameters": {
        "type": "object",
        "properties": {
          "job_id": {
            "type": "string"
          },
          "country": {
            "type": "string"
          },
          "language": {
            "type": "string"
          }
        }
      },
      "data": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "job_id": {
              "type": "string"
            },
            "job_title": {
              "type": "string"
            },
            "employer_name": {
              "type": "string"
            },
            "employer_logo": {
              "type": "null"
            },
            "employer_website": {
              "type": "null"
            },
            "job_publisher": {
              "type": "string"
            },
            "job_employment_type": {
              "type": "string"
            },
            "job_employment_types": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "job_apply_link": {
              "type": "string"
            },
            "job_apply_is_direct": {
              "type": "boolean"
            },
            "apply_options": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "publisher": {
                    "type": "string"
                  },
                  "apply_link": {
                    "type": "string"
                  },
                  "is_direct": {
                    "type": "boolean"
                  }
                }
              }
            },
            "job_description": {
              "type": "string"
            },
            "job_is_remote": {
              "type": "null"
            },
            "job_posted_at": {
              "type": "string"
            },
            "job_posted_at_timestamp": {
              "type": "integer"
            },
            "job_posted_at_datetime_utc": {
              "type": "string"
            },
            "job_location": {
              "type": "string"
            },
            "job_city": {
              "type": "string"
            },
            "job_state": {
              "type": "string"
            },
            "job_country": {
              "type": "string"
            },
            "job_latitude": {
              "type": "number"
            },
            "job_longitude": {
              "type": "number"
            },
            "job_benefits": {
              "type": "null"
            },
            "job_google_link": {
              "type": "string"
            },
            "job_salary": {
              "type": "null"
            },
            "job_min_salary": {
              "type": "null"
            },
            "job_max_salary": {
              "type": "null"
            },
            "job_salary_period": {
              "type": "null"
            },
            "job_highlights": {
              "type": "object",
              "properties": {
                "Qualifications": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "Responsibilities": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              }
            },
            "job_onet_soc": {
              "type": "string"
            },
            "job_onet_job_zone": {
              "type": "string"
            }
          }
        }
      }
    }
  }
