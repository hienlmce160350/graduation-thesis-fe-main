import Navigation from "../../components/navigation";
import HeadComponent from "../../components/header";

export default function ManagerLayout({ children }) {
  return (
    <div class="flex h-[100vh]">
      <div class="w-fit ">
        <Navigation></Navigation>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="bg-white border">
          <HeadComponent></HeadComponent>
        </div>
        <div class="flex-1 bg-[#f6f6f6] px-4 border border-b-0">{children}</div>
      </div>
    </div>
  );
}
