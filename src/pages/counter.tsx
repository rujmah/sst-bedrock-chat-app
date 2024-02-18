import { decrement, increamentByAmount, increment } from "@/redux/counterSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

const Counter = () => {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const incrementAmount = evt.currentTarget.incrementAmount.value;
    dispatch(increamentByAmount(Number(incrementAmount) || 0));
    evt.currentTarget.incrementAmount.value = "";
  };

  return (
    <div className="m-10 w-screen">
      <div className="text-center">
        counter
        <div className="text-9xl">{count}</div>
        <button className="btn" onClick={() => dispatch(increment())}>
          Increment
        </button>
        <button className="btn" onClick={() => dispatch(decrement())}>
          Decrement
        </button>
        <form onSubmit={evt => handleSubmit(evt)}>
          <input type="number" name="incrementAmount" className="text-input" />
          <input type="submit" value="Submit" className="btn" />
        </form>
      </div>
    </div>
  );
};

export default Counter;
