import style from "./EmptyPacks.module.css";

export default function EmptyPacks() {

    return (
        <div
            className={style.container}
        >
            <div>
                <h1>You do not have any packs...</h1>
                <small>Open the dashboard to create a pack</small>
            </div>
        </div>
    )
}