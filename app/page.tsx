import FutureCircle from "@/components/future-circle";
import FutureCircleStatic from "@/components/future-circle/future-circle-static";
import WebNominee from "@/components/web-nominee";
import ScrollPinContainer from "@/components/scroll-pin-container";
import Cursor from "@/components/cursor";

export default function Home() {
	return (
		<>
			<Cursor />
			{/* <ScrollPinContainer> */}
			{/* <FutureCircleStatic /> */}
			<FutureCircle />
			<WebNominee />
			{/* </ScrollPinContainer> */}
		</>
	);
}
