import * as React from "react"
import { cn } from "@/lib/utils"

// maxLengthに基づいて幅を計算する関数
const getInputWidth = (maxLength: number | undefined): string => {
  if (!maxLength) return "w-full"
  
  // maxLengthが20を超える場合は全幅
  if (maxLength > 20) return "w-full"
  
  // Tailwindのクラスに変換（数字入力欄の等幅フォントを想定）
  // 1文字あたり約0.55rem + パディング（px-4 = 1rem左右）を考慮
  if (maxLength <= 3) return "w-20"   // 約80px (3文字 + パディング)
  if (maxLength <= 4) return "w-24"   // 約96px (4文字 + パディング)
  if (maxLength <= 7) return "w-32"   // 約128px (7文字 + パディング)
  if (maxLength <= 8) return "w-36"   // 約144px (8文字 + パディング)
  if (maxLength <= 9) return "w-40"   // 約160px (9文字 + パディング)
  if (maxLength <= 10) return "w-44"  // 約176px (10文字 + パディング)
  if (maxLength <= 20) return "w-64"  // 約256px (20文字 + パディング)
  
  return "w-full"
}

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, maxLength, onChange, onPaste, ...props }, ref) => {
    const widthClass = getInputWidth(maxLength)
    
    // onChangeイベントで文字数制限
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (maxLength && e.target.value.length > maxLength) {
        e.target.value = e.target.value.slice(0, maxLength)
      }
      onChange?.(e)
    }
    
    // onPasteイベントで貼り付け時の文字数制限
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (maxLength) {
        e.preventDefault()
        const pastedText = e.clipboardData.getData('text')
        const currentValue = (e.currentTarget as HTMLInputElement).value
        const selectionStart = (e.currentTarget as HTMLInputElement).selectionStart || 0
        const selectionEnd = (e.currentTarget as HTMLInputElement).selectionEnd || 0
        
        // 選択範囲を削除してから貼り付け
        const newValue = 
          currentValue.slice(0, selectionStart) + 
          pastedText.slice(0, maxLength - (currentValue.length - (selectionEnd - selectionStart))) +
          currentValue.slice(selectionEnd)
        
        // maxLengthを超えないように制限
        const limitedValue = newValue.slice(0, maxLength)
        
        // 値を設定
        ;(e.currentTarget as HTMLInputElement).value = limitedValue
        
        // onChangeイベントを発火
        const syntheticEvent = {
          ...e,
          target: e.currentTarget,
          currentTarget: e.currentTarget,
        } as React.ChangeEvent<HTMLInputElement>
        
        handleChange(syntheticEvent)
      } else {
        onPaste?.(e)
      }
    }
    
    // onInputイベントでリアルタイム制限（追加の安全策）
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      if (maxLength) {
        const target = e.currentTarget
        if (target.value.length > maxLength) {
          target.value = target.value.slice(0, maxLength)
          // onChangeイベントを発火
          const syntheticEvent = {
            ...e,
            target,
            currentTarget: target,
          } as React.ChangeEvent<HTMLInputElement>
          handleChange(syntheticEvent)
        }
      }
    }
    
    return (
      <input
        type={type}
        maxLength={maxLength}
        onChange={handleChange}
        onPaste={handlePaste}
        onInput={handleInput}
        className={cn(
          "flex h-11 rounded-lg border border-input bg-background px-4 py-2 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm box-border",
          widthClass,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
