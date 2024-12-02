import Link from "next/link";
import ScreenReceiver from '../../components/ScreenReceiver'



export default function Home() {
    return (
        <main>
            <h2>Admin can able to view the user screen share</h2>
                <div>
                    <ScreenReceiver />
                </div>
        </main>
    );
}
