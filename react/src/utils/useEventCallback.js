/* 

  // 记忆一个经常重新创建的函数, 避免在渲染期间重复创建

  let [text,setText]=useState('');
  let onSubmit=useEventCallback(()=>{},[text]);

  <form onSubmit={onSubmit}>
    <input value={text} onChange={e=>setText(e.target.value)} />
    <input type="submit" />
  </form>

 */

let useEventCallback = (fun, dependencies) => {
  let ref = useRef(() => {
    throw new Error('');
  });

  useEffect(() => {
    ref.current = fun;
  }, [fun, ...dependencies]);

  let cb = useCallback(() => ref.current(), [ref]);
  return cb;
};

export default useEventCallback;
