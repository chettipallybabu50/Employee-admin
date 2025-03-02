"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { ToastContainer,toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"; 
import * as Yup from "yup";

const Mysignup = () => {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen  bg-gradient-to-r from-green-500 to-teal-600"> {/* Center the form */}
      <Formik
        initialValues={{ username: "", password: "" , Mail_id:"",}}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
          Mail_id : Yup.string().required("Password is required"),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          console.log("Form Submitted", values);
          console.log("Form setSubmitting", setSubmitting);

        //   try {
        //     const response = await fetch("/api/sign", {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify(values), // Send form values
        //     });

        //     const data = await response.json();
        //     console.log("Response from API:", data);
        //     console.log('logi check',data.success)
        //     if(data.success){
        //       console.log('logi check11111',data.success)
        //       toast.success("Sign-in successful!");
        //       router.push("/students");
        //     }
        //     else{
        //         console.log('----->> failed login')
        //         toast.error("Invalid credentials");
        //     }
        //   } catch (error) {
        //     console.error("Error submitting form:", error);
        //   }

          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="p-6 border rounded-md shadow-lg bg-white w-80">
            <h2 className="text-center text-xl font-semibold mb-4">Sign Up</h2>

            <div className="mb-3">
              <label className="block font-medium">Mail Id:</label>
              <Field type="text" name="Mail_id" className="border p-2 w-full rounded" />
              <ErrorMessage name="Mail_id" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-3">
              <label className="block font-medium">Username:</label>
              <Field type="text" name="username" className="border p-2 w-full rounded" />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-3">
              <label className="block font-medium">Password:</label>
              <Field type="password" name="password" className="border p-2 w-full rounded" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="mt-2 p-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Submit
            </button>

            <div className="mt-3 text-center">
              <span>Already have an account? </span>
              <Link href="/" className="text-blue-600 hover:underline font-semibold">
                Login here
              </Link>
            </div>
           
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Mysignup;
