"use client";
import React from "react";
import { useFormik } from "formik";
import { Notification } from "@douyinfe/semi-ui";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { FaQuestionCircle } from "react-icons/fa";
import { Popover, Tag, Checkbox } from "@douyinfe/semi-ui";
import { Modal } from "@douyinfe/semi-ui";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome, IconBulb } from "@douyinfe/semi-icons";
import { Spin } from "@douyinfe/semi-ui";
import { Select } from "@douyinfe/semi-ui";
import AIScreen from "../AI/AIScreen.css";
const validationSchema = Yup.object().shape({
  height: Yup.number().required("Height is required"),
  currentWeight: Yup.number().required("Current Weight is required"),
  goalWeight: Yup.number().required("Goal Weight is required"),
  productAllergies: Yup.string(),
});
const getFieldLabel = (fieldName) => {
  const formattedFieldName = fieldName
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

  return formattedFieldName;
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

let AcceptedTermOfUsePopup = {
  title: "Notification",
  content:
    "Please read and accept all of our terms of use to use this feature.",
  duration: 3,
  theme: "light",
};
// End show notification

// Popover hover
const tops = [["topLeft", "TL"]];

const tooltips = [
  // Tooltip content for Step 1 fields
  [
    "Height represents your current height.",
    "Weight represents your current weight.",
    "Goal Weight is your desired weight",
    "Please make a list of products you are allergic to. Ex: nuts, fruits,...",
  ],
  // Tooltip content for Step 2 fields
  [
    "Select your gender.",
    "Select your age range.",
    "Select your goal.",
    "Select your body type.",
  ],
  // Tooltip content for Step 3 fields
  [
    "Select your body goal.",
    "Select the time you spend on workouts.",
    "When was your last perfect weight?",
    "Select your workout frequency.",
  ],
  // Tooltip content for Step 4 fields
  [
    "Select how often you feel tired.",
    "Select your target workout zone.",
    "Select your daily sleep duration.",
    "Select your daily water intake.",
    "Select your dietary preference.",
  ],
];
//end popover hover

const AIHelp = () => {
  const router = useRouter();

  const [ids, setIds] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

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
        setLoading(true);
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
        // const storedLanguage = localStorage.getItem("language");

        const credentials = {
          userId: userId,
          // languageId: storedLanguage,
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
          //console.log("Accept all term = true");
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
            setLoading(false);
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
            setLoading(false);
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

  // get UserById
  const getUserById = async () => {
    const userId = Cookies.get("userId");
    const bearerToken = Cookies.get("token");
    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            Method: "GET",
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.resultObj.acceptedTermOfUse == false) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      console.log("user data", data.resultObj);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // call API Update accepted term of use
  const editStatusTermOfUse = async () => {
    const userId = Cookies.get("userId");
    const bearerToken = Cookies.get("token");
    let request = {
      userId: userId,
      isAccepted: true,
    };
    try {
      const response = await fetch(
        `https://eatright2.azurewebsites.net/api/Users/UpdateAcceptedTermOfUse`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${bearerToken}`, // Thêm Bearer Token vào headers
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        console.log("update sucess");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  // End edit user

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
        // const data = response.json();
        // console.log("User Detail Result:", data);
        // Now you can access specific information, for example:
        let idsTmp = [...ids];
        // Handle the response data as needed
        if (response.ok) {
          // Success logic
          Notification.close(idsTmp.shift());
          setIds(idsTmp);
          Notification.success(createResultSuccessMess);
          setLoading(false);
          router.push("/customerPage");
        } else {
          Notification.error(createResultErrorMess);
          setLoading(false);
        }
      })
      .then((data) => {
        console.log("Data: " + JSON.stringify(data));
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
        // Handle errors
      });
  };
  // end create result By AI

  //pop up term of use
  const [visible, setVisible] = useState();
  const handleOk = () => {
    if (checkboxChecked === true) {
      // API PuT
      editStatusTermOfUse();
      setVisible(false);
    } else {
      let idsTmp = [...ids];
      Notification.close(idsTmp.shift());
      setIds(idsTmp);
      Notification.error(AcceptedTermOfUsePopup);
      setVisible(true);
    }
  };
  //end logic pop up term of use

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const isLastStep = currentStep === steps.length - 1;
  const [checkboxChecked, setCheckboxChecked] = useState();
  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
  };

  useEffect(() => {
    getUserById();
    getResultByUserId();
  }, []);
  return (
    <>
      <div>
        <Modal
          visible={visible}
          closable={false}
          size="medium"
          style={{ height: "600px", overflow: "auto" }}
          footer={
            <div>
              <button
                className="mb-10 p-2 border rounded-lg"
                onClick={handleOk}
              >
                Close
              </button>
            </div>
          }
        >
          <div className="w-full h-[480px] overflow-y-scroll">
            <div className="bg-gray-100 min-h-screen flex items-center justify-center">
              <div className="max-w-4xl bg-white p-8 rounded-lg shadow-md">
                <h1>
                  <title>Terms of Use</title>
                </h1>
                <h1 className="text-3xl font-semibold mb-8">Terms of Use</h1>
                <div className="terms-content text-gray-700">
                  <p className="mb-4">
                    Welcome to{" "}
                    <span className="font-semibold">EatRightify System</span>, a
                    platform dedicated to providing personalized product
                    recommendations based on user information and preferences.
                    These Terms of Use govern your use of our services, so
                    please read them carefully before proceeding. By accessing
                    or using our platform, you agree to abide by these terms. If
                    you do not agree with any part of these terms, you may not
                    use our services.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">
                      1. Acceptance of Terms:
                    </span>{" "}
                    By accessing or using our platform, you acknowledge that you
                    have read, understood, and agree to be bound by these Terms
                    of Use. These terms constitute a legally binding agreement
                    between you and{" "}
                    <span className="font-semibold">EatRightify System</span>.
                    If you do not agree to these terms, you may not access or
                    use our services.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">2. User Eligibility:</span>{" "}
                    You must be at least 18 years old to use our platform. By
                    accessing or using our services, you represent and warrant
                    that you are at least 18 years old and have the legal
                    capacity to enter into these Terms of Use.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">
                      3. Personalized Recommendations:
                    </span>{" "}
                    Our platform utilizes artificial intelligence algorithms to
                    generate personalized product recommendations based on the
                    information provided by users. By providing details such as
                    age range, goals, weight, height, goal weight, etc., you
                    agree to allow us to process and analyze this information to
                    generate tailored recommendations for you.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">
                      4. Accuracy of Information:
                    </span>{" "}
                    While we strive to provide accurate and reliable
                    recommendations, we cannot guarantee the accuracy,
                    completeness, or reliability of the information provided.
                    Users are responsible for ensuring the accuracy of the
                    information they provide to us.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">5. Privacy:</span> We are
                    committed to protecting the privacy and confidentiality of
                    our users' information. Please refer to our Privacy Policy
                    for details on how we collect, use, and disclose personal
                    information.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">6. User Conduct:</span> You
                    agree to use our platform in compliance with all applicable
                    laws, regulations, and these Terms of Use. You must not
                    engage in any conduct that may disrupt, damage, or impair
                    our services or interfere with other users' access to our
                    platform.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">
                      7. Intellectual Property:
                    </span>{" "}
                    All content and materials available on our platform,
                    including but not limited to text, graphics, logos, images,
                    and software, are the property of{" "}
                    <span className="font-semibold">EatRightify System</span> or
                    its licensors and are protected by copyright, trademark, and
                    other intellectual property laws.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">
                      8. Limitation of Liability:
                    </span>{" "}
                    To the fullest extent permitted by law,{" "}
                    <span className="font-semibold">EatRightify System</span>{" "}
                    shall not be liable for any direct, indirect, incidental,
                    special, or consequential damages arising out of or in any
                    way connected with your use of our platform.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">
                      9. Modification of Terms:
                    </span>{" "}
                    We reserve the right to modify or update these Terms of Use
                    at any time without prior notice. Your continued use of our
                    services following any such changes constitutes your
                    acceptance of the modified terms.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">10. Termination:</span> We
                    reserve the right to suspend or terminate your access to our
                    platform at any time for any reason, including but not
                    limited to violation of these Terms of Use.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">11. Governing Law:</span>{" "}
                    These Terms of Use shall be governed by and construed in
                    accordance with the laws of{" "}
                    <span className="font-semibold">
                      Ninh Kieu - Can Tho, Viet Nam
                    </span>
                    , without regard to its conflict of law principles.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">12.</span> The service will
                    protect the user's personal information and only use it for
                    the purpose of recommending "eat clean" products.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">13.</span> The system will
                    provide instructions and advice on how to integrate the
                    products into the user's daily diet.
                  </p>
                  <p className="mb-4">
                    <span className="font-semibold">14.</span> Users can provide
                    information about their personal health goals such as weight
                    loss, weight gain, maintaining current weight, or improving
                    overall health.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">15.</span> The system will
                    prompt users to provide information about the intensity and
                    type of exercise or physical activity they engage in daily.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">16.</span> Information about
                    the user's current lifestyle and diet will also be collected
                    to better understand nutritional needs and eating habits.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">17.</span> Based on personal
                    information and goals, the system will suggest "eat clean"
                    products that are suitable for the user's nutritional needs
                    and health goals.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">18.</span> Product
                    recommendations will be based on criteria such as
                    nutritional content, calorie count, protein, fat, and
                    carbohydrate levels.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">19.</span> The system will
                    consider factors such as diet, physical form, and exercise
                    regimen to propose products that meet the user's needs.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">20.</span> Recommended
                    products may include foods that are free from preservatives,
                    additives, and are naturally sourced.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">21.</span> Information about
                    dietary restrictions such as food allergies will also be
                    required to eliminate unsuitable products.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">22.</span> The system will
                    continuously update and adjust product recommendations based
                    on changes in the user's personal information.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">23.</span> Users can provide
                    feedback on recommended products to improve the quality of
                    the service.
                  </p>

                  <p className="mb-4">
                    <span className="font-semibold">24. Contact Us:</span> If
                    you have any questions or concerns about these Terms of Use,
                    please contact us at{" "}
                    <span className="font-semibold">ERS@gmail.com</span>.
                  </p>
                </div>
                <Checkbox
                  checked={checkboxChecked}
                  onChange={handleCheckboxChange}
                >
                  I have read and accept all terms
                </Checkbox>
              </div>
            </div>
          </div>
        </Modal>
      </div>

      <div className="max-w-7xl mx-auto my-4 px-4">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />} href="/customerPage/home">
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item icon={<IconBulb />} noLink={true}>
              AI Help
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto items-center md:my-2">
        <div className="md:w-2/3 lg:w-1/2 h-1/2">
          <img className="" src="/staticImage/bgai.png"></img>
        </div>

        <div className="col-span-1 w-full lg:w-[35%] h-[50%] shadow-2xl flex">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full p-8 shadow-md !pt-0"
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

            {steps[currentStep].fields.map((fieldName, index) => (
              <div key={fieldName} className="mb-4">
                <div className="flex">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={fieldName}
                  >
                    {getFieldLabel(fieldName)}
                  </label>

                  <Popover
                    showArrow
                    arrowPointAtCenter
                    content={<article>{tooltips[currentStep][index]}</article>}
                    position="topLeft"
                  >
                    <span className="cursor-pointer ml-1 opacity-20">
                      <FaQuestionCircle />
                    </span>
                  </Popover>
                </div>
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
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:border-indigo-500 custom-select"
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
                  className="w-24 text-[#74A65D] border border-[#74A65D] hover:border-[#44703D] hover:border hover:text-[#44703D] rounded-lg p-2 "
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                onClick={isLastStep ? formik.submitForm : handleNext}
                className="flex justify-center items-center w-24 bg-[#74A65D] text-white hover:bg-[#44703D] rounded-lg p-2"
              >
                <p>{isLastStep ? "Submit" : "Next"}</p>

                {loading ? (
                  <div className="w-7 pr-8">
                    <Spin size="medium" wrapperClassName="bottom-[6px]" />
                  </div>
                ) : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIHelp;
