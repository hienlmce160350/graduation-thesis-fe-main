"use client";

import { Checkbox } from "@/node_modules/@douyinfe/semi-ui/lib/es/index";
import React, { useState, useEffect } from "react";

const TermsOfUse = () => {
  const [checkboxChecked, setCheckboxChecked] = useState(
    localStorage.getItem("termsAccepted") === "true"
  );

  useEffect(() => {
    localStorage.setItem("termsAccepted", checkboxChecked);
  }, [checkboxChecked]);

  const handleCheckboxChange = (e) => {
    setCheckboxChecked(e.target.checked);
  };
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-md">
        <h1>
          <title>Terms of Use</title>
        </h1>
        <h1 className="text-3xl font-semibold mb-8">Terms of Use</h1>
        <div className="terms-content text-gray-700">
          <p className="mb-4">
            Welcome to <span className="font-semibold">EatRightify System</span>
            , a platform dedicated to providing personalized product
            recommendations based on user information and preferences. These
            Terms of Use govern your use of our services, so please read them
            carefully before proceeding. By accessing or using our platform, you
            agree to abide by these terms. If you do not agree with any part of
            these terms, you may not use our services.
          </p>

          <p className="mb-4">
            <span className="font-semibold">1. Acceptance of Terms:</span> By
            accessing or using our platform, you acknowledge that you have read,
            understood, and agree to be bound by these Terms of Use. These terms
            constitute a legally binding agreement between you and{" "}
            <span className="font-semibold">EatRightify System</span>. If you do
            not agree to these terms, you may not access or use our services.
          </p>

          <p className="mb-4">
            <span className="font-semibold">2. User Eligibility:</span> You must
            be at least 18 years old to use our platform. By accessing or using
            our services, you represent and warrant that you are at least 18
            years old and have the legal capacity to enter into these Terms of
            Use.
          </p>

          <p className="mb-4">
            <span className="font-semibold">
              3. Personalized Recommendations:
            </span>{" "}
            Our platform utilizes artificial intelligence algorithms to generate
            personalized product recommendations based on the information
            provided by users. By providing details such as age range, goals,
            weight, height, goal weight, etc., you agree to allow us to process
            and analyze this information to generate tailored recommendations
            for you.
          </p>

          <p className="mb-4">
            <span className="font-semibold">4. Accuracy of Information:</span>{" "}
            While we strive to provide accurate and reliable recommendations, we
            cannot guarantee the accuracy, completeness, or reliability of the
            information provided. Users are responsible for ensuring the
            accuracy of the information they provide to us.
          </p>

          <p className="mb-4">
            <span className="font-semibold">5. Privacy:</span> We are committed
            to protecting the privacy and confidentiality of our users'
            information. Please refer to our Privacy Policy for details on how
            we collect, use, and disclose personal information.
          </p>

          <p className="mb-4">
            <span className="font-semibold">6. User Conduct:</span> You agree to
            use our platform in compliance with all applicable laws,
            regulations, and these Terms of Use. You must not engage in any
            conduct that may disrupt, damage, or impair our services or
            interfere with other users' access to our platform.
          </p>

          <p className="mb-4">
            <span className="font-semibold">7. Intellectual Property:</span> All
            content and materials available on our platform, including but not
            limited to text, graphics, logos, images, and software, are the
            property of{" "}
            <span className="font-semibold">EatRightify System</span> or its
            licensors and are protected by copyright, trademark, and other
            intellectual property laws.
          </p>

          <p className="mb-4">
            <span className="font-semibold">8. Limitation of Liability:</span>{" "}
            To the fullest extent permitted by law,{" "}
            <span className="font-semibold">EatRightify System</span> shall not
            be liable for any direct, indirect, incidental, special, or
            consequential damages arising out of or in any way connected with
            your use of our platform.
          </p>

          <p className="mb-4">
            <span className="font-semibold">9. Modification of Terms:</span> We
            reserve the right to modify or update these Terms of Use at any time
            without prior notice. Your continued use of our services following
            any such changes constitutes your acceptance of the modified terms.
          </p>

          <p className="mb-4">
            <span className="font-semibold">10. Termination:</span> We reserve
            the right to suspend or terminate your access to our platform at any
            time for any reason, including but not limited to violation of these
            Terms of Use.
          </p>

          <p className="mb-4">
            <span className="font-semibold">11. Governing Law:</span> These
            Terms of Use shall be governed by and construed in accordance with
            the laws of{" "}
            <span className="font-semibold">Ninh Kieu - Can Tho, Viet Nam</span>
            , without regard to its conflict of law principles.
          </p>

          <p className="mb-4">
            <span className="font-semibold">12.</span> The service will protect
            the user's personal information and only use it for the purpose of
            recommending "eat clean" products.
          </p>

          <p className="mb-4">
            <span className="font-semibold">13.</span> The system will provide
            instructions and advice on how to integrate the products into the
            user's daily diet.
          </p>
          <p className="mb-4">
            <span className="font-semibold">14.</span> Users can provide
            information about their personal health goals such as weight loss,
            weight gain, maintaining current weight, or improving overall
            health.
          </p>

          <p className="mb-4">
            <span className="font-semibold">15.</span> The system will prompt
            users to provide information about the intensity and type of
            exercise or physical activity they engage in daily.
          </p>

          <p className="mb-4">
            <span className="font-semibold">16.</span> Information about the
            user's current lifestyle and diet will also be collected to better
            understand nutritional needs and eating habits.
          </p>

          <p className="mb-4">
            <span className="font-semibold">17.</span> Based on personal
            information and goals, the system will suggest "eat clean" products
            that are suitable for the user's nutritional needs and health goals.
          </p>

          <p className="mb-4">
            <span className="font-semibold">18.</span> Product recommendations
            will be based on criteria such as nutritional content, calorie
            count, protein, fat, and carbohydrate levels.
          </p>

          <p className="mb-4">
            <span className="font-semibold">19.</span> The system will consider
            factors such as diet, physical form, and exercise regimen to propose
            products that meet the user's needs.
          </p>

          <p className="mb-4">
            <span className="font-semibold">20.</span> Recommended products may
            include foods that are free from preservatives, additives, and are
            naturally sourced.
          </p>

          <p className="mb-4">
            <span className="font-semibold">21.</span> Information about dietary
            restrictions such as food allergies will also be required to
            eliminate unsuitable products.
          </p>

          <p className="mb-4">
            <span className="font-semibold">22.</span> The system will
            continuously update and adjust product recommendations based on
            changes in the user's personal information.
          </p>

          <p className="mb-4">
            <span className="font-semibold">23.</span> Users can provide
            feedback on recommended products to improve the quality of the
            service.
          </p>

          <p className="mb-4">
            <span className="font-semibold">24. Contact Us:</span> If you have
            any questions or concerns about these Terms of Use, please contact
            us at <span className="font-semibold">ERS@gmail.com</span>.
          </p>
        </div>
        <Checkbox checked={checkboxChecked} onChange={handleCheckboxChange}>
          I have read and accept all terms
        </Checkbox>
      </div>
    </div>
  );
};

export default TermsOfUse;
