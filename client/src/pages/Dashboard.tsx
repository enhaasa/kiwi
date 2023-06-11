import useRealm from "../hooks/useRealm";
import { useEffect } from "react";

export default function Dashboard() {
    const realm = useRealm();

    useEffect(() => {
        realm.refresh();
    }, []);



    return (
        <div className="Dashboard">
            <div className="wrapper">
                <aside>
                    <div>
                        {realm.get ? realm.get.name : "Loading..."}
                    </div>
                    <nav>
                        <button>Home</button>
                        <button>Profile</button>
                        <button>Apps</button>
                    </nav>
                    <div>
                        Kiwi
                        by Enhasa
                    </div>
                </aside>

                <main>
                    <section>
                        {realm.get ? realm.get.address : "Loading..."}
                    </section>

                    <section>
                        Venue Stats
                    </section>

                    

                </main>
            </div>
        </div>
    );
}