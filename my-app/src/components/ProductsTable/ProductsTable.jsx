import React, { useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { WhiteTextField } from './WhiteTextField';
import { StyledLink } from './ProductsTable.styled';
import axios from 'axios';
import { Report } from 'notiflix/build/notiflix-report-aio';

export const ProductTable = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [user, setUser] = useState({
    name: '',
    surname: '',
    city: '',
    nova: '',
    order: [],
  });

  const handleQuantityChange = (product, quantity, summ) => {
    const newOrder = { product, quantity, summ: correctPrice(summ) };
    setSelectedProducts([...selectedProducts.filter(item => item.product !== product), newOrder]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const TOKEN = '5749406904:AAH15xGgkatWdNZzaPdv210WX-a1iXaiFM0';
    const CHAT_ID = '-1001711415662';
    const URL_API = `https://api.telegram.org/bot${TOKEN}/sendMessage`;

    let message = `<b>Заявка с сайта!</b>\n`;

    const newUser = {
      ...user,
      name: form.name.value,
      surname: form.surname.value,
      city: form.city.value,
      nova: form.nova.value,
      order: selectedProducts,
    };
    setUser(newUser);

    message += `<b>Имя: </b> ${form.name.value}\n`;
    message += `<b>Фамилия: </b> ${form.surname.value}\n`;
    message += `<b>Город: </b> ${form.city.value}\n`;
    message += `<b>Новая почта: </b> ${form.nova.value}\n`;
    message += `<b>Заказ:</b>\n${selectedProducts
      .map((item, index) => `${item.product} - ${item.quantity}`)
      .join('\n')}`;

    axios
      .post(URL_API, {
        chat_id: CHAT_ID,
        parse_mode: 'html',
        text: message,
      })
      .then(res => {
        setUser({
          name: '',
          surname: '',
          city: '',
          nova: '',
          order: [],
        });
        setSelectedProducts([]);
        Report.success('Успешно', 'Ваш заказ успешно отправлен, ожидайте отправку', 'Okay');
      })
      .catch(error => {
        Report.failure('Ошибка', 'Ошибка, попробуйте снова', 'Okay');
      });

    // console.log('user', user);
    // console.log('selecter', selectedProducts);
    // console.log('Отправка заказа:', selectedProducts);
  };

  const handleDeleteOrder = product => {
    setSelectedProducts(selectedProducts.filter(item => item.product !== product));
  };

  const correctPrice = price => {
    let number;
    if (typeof price === 'number') {
      number = price;
    } else {
      number = parseFloat(price.replace(',', '.'));
    }
    const roundedNumber = Math.round(number * 100) / 100;
    return Number(roundedNumber.toFixed(2));
  };

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>Артикул</th>
            <th>Название товара</th>
            <th>Цена</th>
            <th>Наличие</th>
            <th className="order-column">Заказ</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.code}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.availability}</td>
              {product.code && (
                <td className="order-column">
                  <input
                    className="order-input"
                    type="number"
                    name={product.code}
                    data-price={product.price}
                    placeholder="шт."
                    onChange={e => {
                      const product = e.target.name;
                      const quantity = Number(e.target.value);
                      const summ = correctPrice(e.target.dataset.price) * quantity;
                      return handleQuantityChange(product, quantity, summ);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="order-form-wrapper">
        <div className="order-fix">
          <StyledLink>Ваш заказ:</StyledLink>
          <form onSubmit={handleSubmit}>
            <WhiteTextField
              id="outlined-basic"
              name="name"
              label="Имя"
              variant="outlined"
              margin="dense"
              sx={{ marginRight: '10px' }}
              autoComplete="off"
              value={user.name}
              onChange={e => setUser({ ...user, name: e.target.value })}
              required
            />
            <WhiteTextField
              name="surname"
              id="outlined-basic"
              label="Фамилия"
              variant="outlined"
              margin="dense"
              value={user.surname}
              onChange={e => setUser({ ...user, surname: e.target.value })}
              autoComplete="off"
              required
            />
            <WhiteTextField
              name="city"
              id="outlined-basic"
              label="Город"
              variant="outlined"
              margin="dense"
              autoComplete="off"
              value={user.city}
              onChange={e => setUser({ ...user, city: e.target.value })}
              sx={{ marginRight: '10px' }}
              required
            />
            <WhiteTextField
              name="nova"
              id="outlined-basic"
              label="Отделение НП"
              variant="outlined"
              margin="dense"
              value={user.nova}
              autoComplete="off"
              onChange={e => setUser({ ...user, nova: e.target.value })}
              required
            />

            <ul>
              {selectedProducts.map(({ product, quantity, summ }) => (
                <li key={product}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '150px',
                      color: '#ffffff',
                    }}
                  >
                    {product}: {quantity} шт. ({summ} $)
                  </span>

                  <Button
                    variant="outlined"
                    onClick={() => handleDeleteOrder(product)}
                    startIcon={<DeleteIcon />}
                    size={'small'}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#e49090',
                      borderColor: 'white',
                      marginLeft: 15,
                    }}
                  >
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
            <p style={{ color: 'white' }}>
              <span>Общая сумма: </span>
              {Math.ceil(
                selectedProducts.reduce((accumulator, currentValue) => {
                  return accumulator + currentValue.summ;
                }, 0) * 100
              ) / 100}
              $
            </p>
            <Button type="submit" variant="contained" color="success">
              Отправить заказ
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
