import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function TestNativeWind() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-white">
      <StyledText className="text-xl font-bold text-blue-500">
        NativeWind is working! 🎉
      </StyledText>
    </StyledView>
  );
}
