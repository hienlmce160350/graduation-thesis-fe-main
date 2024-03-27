"use client";
import { Breadcrumb } from "@douyinfe/semi-ui";
import { IconHome } from "@douyinfe/semi-icons";
import Link from "next/link";

const Policy = () => {
  return (
    <>
      <div className="max-w-7xl mx-auto my-4 px-4 mb-10">
        <div className="p-[7px] bg-[#eee]">
          <Breadcrumb compact={false}>
            <Breadcrumb.Item icon={<IconHome />}>
              <Link href="/customerPage/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item noLink={true}>Purchase Policy</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div>
          <div className="flex justify-center my-4 items-center flex-col">
            <h1 className="text-4xl font-bold text-[#74A65D]">
              Purchase Policy
            </h1>
            <div className="h-1 w-32 mt-3 bg-[#74A65D]"></div>
          </div>
          <div className="text-lg">
            <p className="font-bold text-xl">
              1. Purpose and scope of information collection
            </p>
            <p className="text-justify">
              Collecting information via Website: eatrightifySystem.shop and
              Inbox on fanpage or phone when customers want to order is for the
              purposes of:
            </p>
            <ul className="list-disc pl-10">
              <li>
                Storage is for the purpose of approving orders and providing
                services.
              </li>
              <li>
                Help customers update information on promotions, advertising,
                and discounts as quickly as possible.
              </li>
              <li>
                Support customer care, resolve complaints related to the company
                and products.
              </li>
            </ul>

            <p className="font-bold mt-4">2. Scope of information use</p>
            <p className="text-justify">
              Customers ordering at website eatrightifySystem.shop will provide
              the following information:
            </p>
            <ul className="list-disc pl-10">
              <li>Full Name.</li>
              <li>Delivery address.</li>
              <li>Phone.</li>
            </ul>
            <p className="text-justify">
              We attach great importance to the security of customer
              information, so we commit to absolutely not arbitrarily use
              customer information for purposes that do not bring benefits to
              customers. We commit not to sell or exchange customer information.
              exchange customer's confidential information to any third party.
              However, in the following special cases, we may reasonably share
              customer information when:
            </p>

            <ul className="list-disc pl-10">
              <li>Get customer's consent.</li>
              <li>
                To protect the interests of the company and its partners: We
                only release customers' personal information when we are sure
                that such information can protect the interests and assets of
                the company. us and related partners. This information will be
                legally disclosed according to Vietnamese Law.
              </li>
              <li>
                At the request of government agencies when we find it consistent
                with Vietnamese law.
              </li>
            </ul>

            <p className="text-justify">
              In some cases it is necessary to provide other customer
              information, such as promotional programs sponsored by a third
              party, for example, we will notify customers before your
              information is disclosed. to shared. You have the right to decide
              whether or not you agree to share information or participate.
            </p>

            <p className="font-bold mt-4">3. Information storage time</p>

            <p className="text-justify">
              Healthy Eating will store Personal Information provided by
              Customers on our internal systems during the process of providing
              services to customers or until the purpose of collection is
              completed or when requested by the Customer. request to cancel the
              information provided.
            </p>

            <p className="font-bold mt-4">
              4. Address of the unit that collects and manages personal
              information
            </p>

            <p className="text-justify">
              <span>Name of unit: EatRightify System COMPANY</span>
              <br></br>
              <span>
                Address: 600, Nguyen Van Cu Street, An Binh Ward, Ninh Kieu
                District, Can Tho City
              </span>
              <br></br>
              <span>Contact phone: 055.122.6868</span>
              <br></br>
              <span>Email: group@gmail.com</span>
            </p>

            <p className="font-bold mt-4">
              5. Means and tools for users to access and edit their personal
              data
            </p>

            <p className="text-justify">
              Customers can exercise the above rights by accessing the website
              themselves or contacting us via email, contact address or phone
              number 055.122.6868 published on the eatrightifySystem.shop
              website.
            </p>

            <p className="font-bold mt-4">
              6. Committed to protecting customer personal information
            </p>

            <p className="text-justify">
              We are committed to ensuring information security for customers
              when registering personal information with our company. We commit
              not to exchange or sell customer information for commercial
              purposes. We commit to all sharing and use of customer information
              in accordance with the company's privacy policy. We are committed
              to making you feel confident and satisfied about the security of
              your personal information when participating and using our
              company's services.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Policy;
