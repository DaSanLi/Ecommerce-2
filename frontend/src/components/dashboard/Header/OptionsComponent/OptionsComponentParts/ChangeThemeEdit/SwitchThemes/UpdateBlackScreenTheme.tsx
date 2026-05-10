import { SetStateAction } from "react";
import SwitchThemes from "./SwitchThemes"

type props = {
    setBlackOptionScreenTheme: React.Dispatch<SetStateAction<boolean>>;
}

const UpdateBlackScreenTheme = ({  setBlackOptionScreenTheme }: props) => {

const exitButton = () => {
    setBlackOptionScreenTheme(prev => !prev)
}

    return (
        <section className="fixed inset-0 z-50 w-screen h-screen bg-black/85 flex items-center justify-center">
            <div className="flex flex-col items-center relative w-72 lg:w-80 h-auto bg-(--bg-secondary)/95 text-white rounded-3xl p-6 lg:p-8">
                <h4 className="text-lg lg:text-xl flex-1 mb-4">Selecciona un tema</h4>
                <div className="flex-2 flex justify-center items-center mb-4">
                    <SwitchThemes />
                </div>
                <button className="flex-1 max-h-12 lg:max-h-14 p-3 lg:p-4 bg-(--color-secondary) hover:bg-(--color-secondary)/50 rounded-2xl w-5/6 text-base lg:text-lg"
                    onClick={() => exitButton()}
                >Salir</button>
            </div>
        </section>
    )
}

export default UpdateBlackScreenTheme