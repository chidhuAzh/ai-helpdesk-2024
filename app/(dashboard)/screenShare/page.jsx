import Link from "next/link";
import ScreenShare from '../../components/ScreenShare'



export default function Home() {
    return (
        <main>
            <h2>User can able to screen share</h2>
            <p>
                Welcome to your dashboard. Here you can manage and monitor all your support tickets and customer inquiries. Stay
                organized and provide excellent customer service using the tools and features available.
            </p>

                <div>
                    <ScreenShare />
                </div>
        </main>
    );
}
