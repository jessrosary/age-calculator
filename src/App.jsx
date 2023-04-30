import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { isInteger, isEmpty, padStart } from 'lodash';

function App() {
  const fields = {
    day: '',
    month: '',
    year: '',
  };

  const [inputDate, setInputDate] = useState(fields);
  const [inputError, setInputError] = useState({});
  const [result, setResult] = useState({});

  const validateDate = () => {
    setInputError(fields);
    const now = DateTime.local();

    const [day, month, year] = [
      parseInt(inputDate.day),
      parseInt(inputDate.month),
      parseInt(inputDate.year),
    ];

    const date = { day, month, year };

    let errors = {};

    ['day', 'month', 'year'].forEach((key) => {
      if (!isInteger(date[key])) {
        errors[key] = 'This field is required';
      }
    });

    if (!errors.year) {
      if (year < 1) {
        errors.year = 'Must be a valid year';
      } else if (year > now.year) {
        errors.year = 'Must be in the past';
      }
    }

    if (!errors.month) {
      if (month < 1 || month > 12) {
        errors.month = 'Must be a valid month';
      }
    }

    if (!errors.day) {
      if (day < 1 || day > 31) {
        errors.day = 'Must be a valid day';
      } else if (
        !errors.year &&
        !errors.month &&
        !DateTime.fromObject(date).isValid
      ) {
        errors.day = 'Must be a valid date';
      }
    }

    setInputError(errors);
    return errors;
  };

  const calculateAge = () => {
    const errors = validateDate();

    // const hasErrors = ['day', 'month', 'year'].every((field) => !errors[field]);

    if (!isEmpty(errors)) {
      console.log('cannot calculate with errors');
      return;
    }

    const [day, month, year] = [
      padStart(inputDate.day, 2, '0'),
      padStart(inputDate.month, 2, '0'),
      padStart(inputDate.year, 4, '0'),
    ];

    // const { day, month, year } = inputDate;
    const isoDate = `${year}-${month}-${day}T12:00`;

    console.log(isoDate);

    const now = DateTime.local();
    const date2 = DateTime.fromISO(isoDate);
    const diff = now.diff(date2, ['years', 'months', 'days']);

    setResult({
      years: diff.values.years,
      months: diff.values.months,
      days: Math.floor(diff.values.days),
    });
  };

  const handleSubmit = (e) => e.key === 'Enter' && calculateAge();

  const handleDate = (e, field) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    setInputDate((prevDate) => ({
      ...prevDate,
      [field]: value,
    }));
  };

  useEffect(() => {
    console.log({ inputError, result });
  }, [inputError, result]);

  return (
    <div className='main-container'>
      <div className='input-container'>
        <div>
          <label htmlFor='day'>day</label>
          <br></br>
          <input
            type='text'
            name='day'
            id='day'
            placeholder='DD'
            maxLength='2'
            value={inputDate.day}
            onKeyDown={handleSubmit}
            onChange={(e) => handleDate(e, 'day')}
          />
          <span className='error-text'>{inputError.day}</span>
        </div>
        <div>
          <label htmlFor='day'>month</label>
          <br></br>
          <input
            type='text'
            name='month'
            id='month'
            placeholder='MM'
            maxLength='2'
            value={inputDate.month}
            onKeyDown={handleSubmit}
            onChange={(e) => handleDate(e, 'month')}
          />
          <span className='error-text month'>{inputError.month}</span>
        </div>
        <div>
          <label htmlFor='day'>year</label>
          <br></br>
          <input
            type='text'
            name='year'
            id='year'
            placeholder='YYYY'
            maxLength='4'
            value={inputDate.year}
            onKeyDown={handleSubmit}
            onChange={(e) => handleDate(e, 'year')}
          />
          <span className='error-text'>{inputError.year}</span>
        </div>
      </div>
      <div>
        <button onClick={() => calculateAge()}>Check</button>
        <hr />
      </div>
      <div className='result-container'>
        <ul>
          <li>
            <span className='day'>{result.years || '--'}</span>&nbsp;years
          </li>
          <li>
            <span className='day'>{result.months || '--'}</span>&nbsp;months
          </li>
          <li>
            <span className='day'>{result.days || '--'}</span>&nbsp;days
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
