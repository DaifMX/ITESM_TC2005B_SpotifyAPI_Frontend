import { useState } from "react";
import { spotifyAPI } from "./api/spotifyAPI";

// import register from "./assets/"
const Register = () => {
    const [form, setForm] = useState({
        firstName: '',
        // lastName: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { value, name } = e.target;
        const newForm = {
            ...form,
            [name]: value,
        };

        setForm(newForm);
    };

    const handleRegistro = async () => {
        const url = 'http://localhost:3000/api/users';
        console.log({ form });
        const data = JSON.stringify(form);
        console.log({ data });
        const res = await spotifyAPI(url, 'POST', data, null);
        console.log(res);
    };

    return (
        <>
            <div style={{ marginBottom: '16px' }}>
                <h1>
                    Register
                </h1>
            </div>
            <div style={{ display: 'flex' }}>
                <div>{/* <img src={register} /> /}</div>
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              value={form.name}
            />
          </label>
          {/ <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              value={form.name}
            />
          </label> */}
                    <label>
                        Email:
                        <input
                            type="text"
                            name="email"
                            onChange={handleChange}
                            value={form.name}
                        />
                    </label>
                    <label
                        style={{ marginLeft: '16px' }}
                    >
                        Password:
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            value={form.name}
                        />
                    </label>
                    <div>
                        <button onClick={handleRegistro} style={{ marginTop: '8px' }}>Registrar</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;