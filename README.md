## This is the example usage


```js
const Explore = () => {
  const ref = useRef<StackSwiperRef>(null);

  const TestLayout = (props: { color: string }) => {
    return <View style={{ flex: 1, backgroundColor: props.color }} />;
  };

  
  const renderItem = (data: number) => {
    return (
      <View
        style={{
          width: Dimensions.get("window").width - 40,
          height: 500,
          backgroundColor: "white",
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ height: 500, width: Dimensions.get("window").width - 40 }}
          source={{ uri: `https://picsum.photos/200/300?${data}` }}
        />
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "whitesmoke",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StackSwiper
        ref={ref}
        cardHeight={500}
        onSwipe={(position, data) => {
          console.log(position, data);
        }}
        renderItem={renderItem}
        endOpacity={1}
        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
        layouts={{
          left: <TestLayout color="red" />,
          right: <TestLayout color="rgba(0, 255, 0, 0.5)" />,
          top: <TestLayout color="blue" />,
        }}
      />

      <TouchableOpacity
        style={{ position: "absolute", top: 70 }}
        onPress={() => {
          console.log(ref.current?.back)
          ref.current?.back?.();
        }}
      >
        <Text>Revert Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Explore;

```