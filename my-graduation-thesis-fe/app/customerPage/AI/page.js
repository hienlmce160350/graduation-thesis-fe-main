"use client";
import React from "react";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const validationSchema = Yup.object().shape({
  height: Yup.number().required("Height is required"),
  currentWeight: Yup.number().required("Current Weight is required"),
  goalWeight: Yup.number().required("Goal Weight is required"),
  productAllergies: Yup.string(),
});
const getFieldLabel = (fieldName) => {
  return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
};
const steps = [
  {
    title: "Step 1",
    fields: ["height", "currentWeight", "goalWeight", "productAllergies"],
  },
  {
    title: "Step 2",
    fields: ["gender", "ageRange", "goal", "bodyType"],
  },
  {
    title: "Step 3",
    fields: ["bodyGoal", "timeSpend", "lastPerfectWeight", "doWorkout"],
  },
  {
    title: "Step 4",
    fields: ["feelTired", "tagetZone", "timeSleep", "waterDrink", "diet"],
  },
];

// Show notification
let errorMess = {
  title: "Error",
  content: "Error. Please try again.",
  duration: 3,
  theme: "light",
};

let createResultSuccessMess = {
  title: "Success",
  content: "Create Result By AI Successfully.",
  duration: 3,
  theme: "light",
};

let createResultErrorMess = {
  title: "Error",
  content: "Addition of result could not be proceed. Please try again.",
  duration: 3,
  theme: "light",
};

let successCreateMess = {
  title: "Success",
  content: "Create Successfully.",
  duration: 3,
  theme: "light",
};

let successUpdateMess = {
  title: "Success",
  content: "Update Successfully.",
  duration: 3,
  theme: "light",
};

let loadingMess = {
  title: "Loading",
  content: "Your task is being processed. Please wait a moment",
  duration: 3,
  theme: "light",
};
// End show notification

const AIHelp = () => {
  const router = useRouter();

  const [ids, setIds] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const formik = useFormik({
    initialValues: {
      id: "",
      gender: 0,
      ageRange: 0,
      goal: 0,
      bodyType: 0,
      bodyGoal: 0,
      tagetZone: 0,
      timeSpend: 0,
      lastPerfectWeight: 0,
      doWorkout: 0,
      feelTired: 0,
      height: 0,
      currentWeight: 0,
      goalWeight: 0,
      timeSleep: 0,
      waterDrink: 0,
      diet: 0,
      productAllergies: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        let id = Notification.info(loadingMess);
        setIds([...ids, id]);
        const userId = Cookies.get("userId");
        values.id = userId;
        values.gender = Number(values.gender);
        values.ageRange = Number(values.ageRange);
        values.goal = Number(values.goal);
        values.bodyType = Number(values.bodyType);
        values.bodyGoal = Number(values.bodyGoal);
        values.tagetZone = Number(values.tagetZone);
        values.timeSpend = Number(values.timeSpend);
        values.lastPerfectWeight = Number(values.lastPerfectWeight);
        values.doWorkout = Number(values.doWorkout);
        values.feelTired = Number(values.feelTired);
        values.timeSleep = Number(values.timeSleep);
        values.waterDrink = Number(values.waterDrink);
        values.diet = Number(values.diet);

        const bearerToken = Cookies.get("token");
        console.log("Values: " + JSON.stringify(values));

        const userDetailResult = await getResultByUserId(); // Call getResultByUserId
        const storedLanguage = localStorage.getItem("language");
        const credentials = {
          userId: userId,
          languageId: storedLanguage,
        };
        let response;
        if (userDetailResult) {
          // If user detail exists, update using PUT
          response = await fetch(
            `https://eatright2.azurewebsites.net/api/UserDetail/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
              },
              method: "PUT",
              body: JSON.stringify(values),
            }
          );
          console.log("Update success");
          if (response.ok) {
            let idsTmp = [...ids];
            Notification.close(idsTmp.shift());
            setIds(idsTmp);
            Notification.success(successUpdateMess);
            await createResult(credentials);
          } else {
            let idsTmp = [...ids];
            Notification.close(idsTmp.shift());
            setIds(idsTmp);
            console.log("An error occurred:", response.status);
            Notification.error(errorMess);
          }
        } else {
          // If user detail doesn't exist, create using POST
          response = await fetch(
            `https://eatright2.azurewebsites.net/api/UserDetail`,
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify(values),
            }
          );
          console.log("Create success");
          if (response.ok) {
            let idsTmp = [...ids];
            Notification.close(idsTmp.shift());
            setIds(idsTmp);
            Notification.success(successCreateMess);
            await createResult(credentials);
          } else {
            let idsTmp = [...ids];
            Notification.close(idsTmp.shift());
            setIds(idsTmp);
            console.log("An error occurred:", response.status);
            Notification.error(errorMess);
          }
        }
      } catch (error) {
        Notification.error(errorMess);
        console.error("An error occurred:", error);
      }
    },
  });

  //getResultByUserIdFunc
  const getResultByUserId = async () => {
    try {
      const userId = Cookies.get("userId");

      const bearerToken = Cookies.get("token"); // Ensure you have the necessary dependencies imported and set up
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/UserDetail/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("User Detail Result:", JSON.stringify(data));
        // Handle the data as needed
        formik.setFieldValue("gender", data.gender);
        formik.setFieldValue("ageRange", data.ageRange);
        formik.setFieldValue("goal", data.goal);
        formik.setFieldValue("bodyType", data.bodyType);
        formik.setFieldValue("bodyGoal", data.bodyGoal);
        formik.setFieldValue("tagetZone", data.tagetZone);
        formik.setFieldValue("timeSpend", data.timeSpend);
        formik.setFieldValue("lastPerfectWeight", data.lastPerfectWeight);
        formik.setFieldValue("doWorkout", data.doWorkout);
        formik.setFieldValue("feelTired", data.feelTired);
        formik.setFieldValue("height", data.height);
        formik.setFieldValue("currentWeight", data.currentWeight);
        formik.setFieldValue("goalWeight", data.goalWeight);
        formik.setFieldValue("timeSleep", data.timeSleep);
        formik.setFieldValue("waterDrink", data.waterDrink);
        formik.setFieldValue("diet", data.diet);
        formik.setFieldValue("productAllergies", data.productAllergies);
        return data;
      } else {
        console.log("An error occurred:", response.status);
        // Handle the error as needed
        return null;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error as needed
      return null;
    }
  };

  // create result By AI
  const createResult = async (credentials) => {
    const bearerToken = Cookies.get("token");
    let id = Notification.info(loadingMess);
    setIds([...ids, id]);
    fetch("https://eatright2.azurewebsites.net/api/Results", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => {
        const data = response.json();
        console.log("User Detail Result:", data);
        // Now you can access specific information, for example:
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (response.ok) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(createResultSuccessMess);
          router.push("/");
        } else {
          Notification.error(createResultErrorMess);
        }
      })
      .then((data) => {
        console.log("Data: " + JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors
      });
  };
  // end create result By AI

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const isLastStep = currentStep === steps.length - 1;
  useEffect(() => {
    getResultByUserId();
  }, []);
  return (
    <div className="w-[800px] m-auto ">
      <div className="bg-[url('/staticImage/AIImage.png')] bg-center bg-no-repeat ">
        <div className="col-span-1 w-[45%] h-[100%]">
          <form
            onSubmit={formik.handleSubmit}
            className="max-w-xl mx-auto bg-white p-8 shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">
              {steps[currentStep].title}
            </h2>

            {/* Display errors at the top of the form */}
            {Object.keys(formik.errors).length > 0 && (
              <div className="text-red-500 mb-4">
                Please correct the following errors before proceeding.
              </div>
            )}

            {steps[currentStep].fields.map((fieldName) => (
              <div key={fieldName} className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor={fieldName}
                >
                  {getFieldLabel(fieldName)}
                </label>
                {[
                  "productAllergies",
                  "gender",
                  "ageRange",
                  "goal",
                  "bodyType",
                  "bodyGoal",
                  "timeSpend",
                  "lastPerfectWeight",
                  "doWorkout",
                  "feelTired",
                  "tagetZone",
                  "timeSleep",
                  "waterDrink",
                  "diet",
                ].includes(fieldName) ? (
                  fieldName === "productAllergies" ? (
                    <input
                      type="text"
                      id={fieldName}
                      name={fieldName}
                      value={formik.values[fieldName]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <select
                      type="number"
                      id={fieldName}
                      name={fieldName}
                      value={formik.values[fieldName]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:border-indigo-500"
                      multiple={fieldName === "productAllergies"}
                    >
                      <option value="" disabled selected>
                        Select an option
                      </option>
                      {fieldName === "gender" && (
                        <>
                          <option value={0}>Male</option>
                          <option value={1}>Female</option>
                        </>
                      )}

                      {fieldName === "ageRange" && (
                        <>
                          <option value={0}>Teenager</option>
                          <option value={1}>Adult</option>
                          <option value={2}>MiddleAged</option>
                          <option value={3}>Senior</option>
                        </>
                      )}

                      {fieldName === "goal" && (
                        <>
                          <option value={0}>MuscleGain</option>
                          <option value={1}>WeightLoss</option>
                          <option value={2}>FitBody</option>
                          <option value={3}>ToneMuscles</option>
                        </>
                      )}

                      {fieldName === "bodyType" && (
                        <>
                          <option value={0}>Skinny</option>
                          <option value={1}>Regular</option>
                          <option value={2}>Plump</option>
                          <option value={3}>ExtraPlump</option>
                        </>
                      )}

                      {fieldName === "bodyGoal" && (
                        <>
                          <option value={0}>Cut</option>
                          <option value={1}>Bulk</option>
                          <option value={2}>ExtraBulk</option>
                          <option value={3}>Fit</option>
                          <option value={4}>Muscular</option>
                          <option value={5}>Shaply</option>
                        </>
                      )}

                      {fieldName === "tagetZone" && (
                        <>
                          <option value={0}>Abs</option>
                          <option value={1}>Arm</option>
                          <option value={2}>Legs</option>
                          <option value={3}>TonedButt</option>
                          <option value={4}>PerkyBeasts</option>
                          <option value={5}>FlatBelly</option>
                        </>
                      )}

                      {fieldName === "timeSpend" && (
                        <>
                          <option value={0}>VeryLow</option>
                          <option value={1}>Low</option>
                          <option value={2}>Medium</option>
                          <option value={3}>High</option>
                          <option value={4}>VeryHigh</option>
                        </>
                      )}

                      {fieldName === "lastPerfectWeight" && (
                        <>
                          <option value={0}>Recently</option>
                          <option value={1}>LongTime</option>
                          <option value={2}>QuiteLongTime</option>
                          <option value={3}>VeryLongTime</option>
                        </>
                      )}

                      {fieldName === "doWorkout" && (
                        <>
                          <option value={0}>Usually</option>
                          <option value={1}>Sometimes</option>
                          <option value={2}>Often</option>
                          <option value={3}>Never</option>
                        </>
                      )}

                      {fieldName === "feelTired" && (
                        <>
                          <option value={0}>Usually</option>
                          <option value={1}>Sometimes</option>
                          <option value={2}>Often</option>
                          <option value={3}>Never</option>
                        </>
                      )}

                      {fieldName === "timeSleep" && (
                        <>
                          <option value={0}>VeryLow</option>
                          <option value={1}>Low</option>
                          <option value={2}>Medium</option>
                          <option value={3}>High</option>
                          <option value={4}>VeryHigh</option>
                        </>
                      )}

                      {fieldName === "waterDrink" && (
                        <>
                          <option value={0}>VeryLow</option>
                          <option value={1}>Low</option>
                          <option value={2}>Medium</option>
                          <option value={3}>High</option>
                          <option value={4}>VeryHigh</option>
                        </>
                      )}

                      {fieldName === "diet" && (
                        <>
                          <option value={0}>Vegetarian</option>
                          <option value={1}>Balanced</option>
                          <option value={2}>Organic</option>
                          <option value={3}>HighFat</option>
                          <option value={4}>LowCarb</option>
                        </>
                      )}
                    </select>
                  )
                ) : (
                  <input
                    type="number"
                    id={fieldName}
                    name={fieldName}
                    value={formik.values[fieldName]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:border-indigo-500"
                  />
                )}

                {formik.errors[fieldName] && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors[fieldName]}
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-between">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-red-500 text-white rounded-lg p-2  w-20"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                onClick={isLastStep ? formik.submitForm : handleNext}
                className="bg-green-400 text-white rounded-lg p-2 w-20"
              >
                {isLastStep ? "Submit" : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIHelp;
