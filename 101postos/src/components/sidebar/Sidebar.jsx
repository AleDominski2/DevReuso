import React, { useState } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar({
    image = "https://ui-avatars.com/api/?name=Júlio+César",
    name = "Nome do Usuário",
    buttonHomeLabel = "Início",
    buttonUserLabel = "Editar Perfil",
    buttonConfigLabel = "Configurações",
    buttonExitLabel = "Sair",
    onButtonHomeClick = () => {},
    onButtonUserClick = () => {},
    onButtonConfigClick = () => {},
    onButtonExitClick = () => {},
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className={styles["sb-toggle"]}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Fechar menu" : "Abrir menu"}
            >
                ⋯
            </button>

            <aside className={`${styles.sb} ${open ? styles.open : ""}`}>
                <div className={styles["sb-inner"]}>
                    <img className={styles["sb-avatar"]} src={image} alt={`Foto de ${name}`} />
                    <div className={styles["sb-name"]}>{name}</div>
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonHomeClick();
                            setOpen(false);
                        }}
                    >
                        {buttonHomeLabel}
                    </button>
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonUserClick();
                            setOpen(false);
                        }}
                    >
                        {buttonUserLabel}
                    </button>
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonConfigClick();
                            setOpen(false);
                        }}
                    >
                        {buttonConfigLabel}
                    </button>
                    <button
                        className={styles["sb-btn"]}
                        onClick={() => {
                            onButtonExitClick();
                            setOpen(false);
                        }}
                    >
                        {buttonExitLabel}
                    </button>
                </div>
            </aside>

            <div
                className={`${styles["sb-backdrop"]} ${open ? styles.show : ""}`}
                onClick={() => setOpen(false)}
            />
        </>
    );
}