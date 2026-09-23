import {test} from 'node:test';import assert from 'node:assert/strict';
import {formatPrice,formatMileage,formatYear,money,number} from '../src/lib/vehicle-format.ts';
test('Central formatters retain the current Brazilian display',()=>{assert.equal(formatPrice(143900).replace(/\s/g,' '),'R$ 143.900');assert.equal(formatMileage(49000),'49.000 km');assert.equal(formatMileage(0),'0 km');assert.equal(formatYear(2023),'2023');assert.equal(formatPrice(143900),money(143900));assert.equal(formatMileage(49000),number(49000)+' km');});
