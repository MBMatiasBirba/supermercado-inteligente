import React from 'react';

const UserConfig = () => {
  return (
    <form>
      <label>Banco:
        <select>
          <option value="galicia">Galicia</option>
          <option value="santander">Santander</option>
          <option value="bbva">BBVA</option>
        </select>
      </label>
      <label>Tarjeta:
        <select>
          <option value="visa">Visa</option>
          <option value="mastercard">Mastercard</option>
        </select>
      </label>
      <label>Ubicación:
        <input type="text" placeholder="Ej: Palermo, CABA" />
      </label>
      <label>Fecha de compra:
        <input type="date" />
      </label>
    </form>
  );
};

export default UserConfig;
