export const CuentaNueva = ()=>{
    return <div>
        <h2>SUSCRIPCIÓN</h2>
        <form>
            <div>
            <label htmlFor="username">Username: </label>
            <input type="text" id="username" name="username"/>
            </div>
            <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
            </div>
            <button type="submit">Suscribirse</button>
        </form>


    </div>
}