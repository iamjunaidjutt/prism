import FutureCircle from "@/components/future-circle";
import FutureCircleStatic from "@/components/future-circle/future-circle-static";
import WebNominee from "@/components/web-nominee";

export default function Home() {
	return (
		<div className="scroll-container">
			<section className="scroll-section h-screen">
				<FutureCircleStatic />
			</section>
			<section className="scroll-section h-screen">
				<FutureCircle />
			</section>
			<section className="scroll-section h-screen">
				<WebNominee />
			</section>
		</div>
	);
}
