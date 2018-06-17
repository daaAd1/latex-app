import React from 'react';
import { render, renderIntoDocument, cleanup, Simulate } from 'react-testing-library';
import 'jest-dom/extend-expect';
import jest from 'jest';
import SequenceMathLine from './SequenceMathLine';

afterEach(cleanup);

test('renders without crashing', () => {
  render(<SequenceMathLine white={false} level={1} cell={1} />);
});

test('renders white cell without crashing', () => {
  const { container } = renderIntoDocument(<SequenceMathLine white level={1} cell={1} />);

  expect(container.firstChild).toMatchSnapshot();
});

test('renders with prop text and text is changed', () => {
  const { getByText } = render(
    <SequenceMathLine white={false} inputText="text" level={1} cell={1} />,
  );

  getByText('text').textContent = 'updated text';

  expect(getByText('updated text'));
});

test('renders cell, clicks length div', () => {
  const handleClick = jest.fn();
  const { getByTestId } = renderIntoDocument(
    <SequenceMathLine onClick={handleClick} white={false} inputText="text" level={1} cell={1} />,
  );

  Simulate.click(getByTestId('line-length'));

  expect(handleClick).toHaveBeenCalledTimes(1);
});
