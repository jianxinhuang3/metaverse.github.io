import os
from pathlib import Path
from PIL import Image

# --- 配置 ---

# 1. 设置你的PNG图片所在的目录
#    （请确保使用正斜杠 '/'，即使在Windows上）
INPUT_DIR = Path("E:\\github\\metaverse.github.io\\img\\avatars\\girl")

# 2. 设置压缩后图片的输出目录
OUTPUT_DIR = Path("E:\\github\\metaverse.github.io\\out")

# 3. 设置压缩级别 (0=不压缩, 9=最大压缩)
#    注意：对于有损压缩，量化(quantize)是主要步骤，
#    compress_level 只是对最终的8位PNG进行无损压缩。
COMPRESS_LEVEL = 9

# --- 脚本主-体 ---

def compress_png_files(input_dir, output_dir, compress_level):
    """
    使用“有损”量化方法压缩指定目录中的所有PNG文件，
    并保存到输出目录。
    """
    # 1. 确保输出目录存在
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"开始扫描目录: {input_dir.resolve()}")
    print(f"将保存到目录: {output_dir.resolve()}")
    print(f"压缩模式: 有损 (量化为 8-bit PNG)")
    print("-" * 30)

    # 2. 检查输入目录是否存在
    if not input_dir.exists() or not input_dir.is_dir():
        print(f"错误: 输入目录 '{input_dir}' 不存在或不是一个目录。")
        return

    # 3. 遍历输入目录中的所有 .png 文件
    png_files = list(input_dir.glob("*.png"))

    if not png_files:
        print("在输入目录中未找到任何 .png 文件。")
        return

    count = 0
    total = len(png_files)
    
    for input_path in png_files:
        # 4. 构建输出文件路径，保持原文件名
        output_path = output_dir / input_path.name
        
        try:
            # 5. 打开图像
            with Image.open(input_path) as img:
                
                # --- 新增：有损压缩（量化）步骤 ---
                
                # 6. 统一转换为RGBA模式，以正确处理透明度
                img = img.convert("RGBA")
                
                # 7. 执行量化（“有损”步骤）
                #    我们尝试使用 LIBIMAGEQUANT (高质量)
                #    如果Pillow不支持，则回退到 FASTOCTREE
                try:
                    # method=Image.Quantize.LIBIMAGEQUANT (值=3) 是最高质量的
                    # dither=Image.Dither.FLOYDSTEINBERG (值=1) 帮助减少色带
                    img = img.quantize(colors=256, method=Image.Quantize.LIBIMAGEQUANT, dither=Image.Dither.FLOYDSTEINBERG)
                except Exception:
                    # print(f"    (注意: {input_path.name} 无法使用 LIBIMAGEQUANT, 回退到 FASTOCTREE)")
                    # method=Image.Quantize.FASTOCTREE (值=2) 是一个快速的备选项
                    img = img.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG)

                # -------------------------------------

                # 8. 保存量化后的图像 (现在是8-bit调色板PNG)
                #    optimize=True 对调色板图像依然有效
                img.save(
                    output_path, 
                    "PNG", 
                    optimize=True, 
                    compress_level=compress_level
                )
            
            # 9. 报告原始和压缩后的大小
            original_size = input_path.stat().st_size / 1024  # KB
            compressed_size = output_path.stat().st_size / 1024 # KB
            
            # 避免除以零的错误（如果原图很小）
            reduction = 0
            if original_size > 0:
                reduction = (1 - compressed_size / original_size) * 100
            
            count += 1
            print(f"({count}/{total}) 压缩成功: {input_path.name}")
            print(f"    大小: {original_size:.2f} KB -> {compressed_size:.2f} KB (节省 {reduction:.1f}%)")

        except Exception as e:
            print(f"处理文件 {input_path.name} 时出错: {e}")

    print("-" * 30)
    print(f"处理完成！共压缩了 {count} 个文件。")

# --- 运行脚本 ---
if __name__ == "__main__":
    # 检查并提醒用户修改路径（如果路径未更改）
    if str(INPUT_DIR) == "path/to/your/images":
        print("**************************************************")
        print("** 请先修改脚本中的 `INPUT_DIR` 变量为你的图片目录! **")
        print("**************************************************")
    else:
        compress_png_files(INPUT_DIR, OUTPUT_DIR, COMPRESS_LEVEL)