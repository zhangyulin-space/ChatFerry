import os
import pathlib
from typing import List, Set

def get_source_file_extensions() -> Set[str]:
    """返回需要处理的源代码文件扩展名集合"""
    return {'.tsx', '.html', '.js', '.ts', '.cjs'}

def should_ignore_directory(dir_name: str) -> bool:
    """判断是否应该忽略该目录"""
    return dir_name in {'.git', 'node_modules', 'dist'}

def find_source_files(root_dir: str) -> List[pathlib.Path]:
    """递归查找所有源代码文件"""
    source_files = []
    extensions = get_source_file_extensions()
    
    for path in pathlib.Path(root_dir).rglob('*'):
        if path.is_file() and path.suffix.lower() in extensions:
            # 检查文件是否在需要忽略的目录中
            if not any(should_ignore_directory(part) for part in path.parts):
                source_files.append(path)
    
    return sorted(source_files)

def read_file_content(file_path: pathlib.Path) -> str:
    """读取文件内容，处理编码问题"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='gbk') as f:
                return f.read()
        except UnicodeDecodeError:
            return f"[Error: Could not decode file {file_path}]"

def create_markdown_table(file_path: pathlib.Path, content: str) -> str:
    """为单个文件创建简单的 Markdown 表格"""
    relative_path = file_path.relative_to(pathlib.Path.cwd())
    table = f"## {relative_path}\n\n"
    table += "------"
    table += "\n\n"
    
    # 添加代码块语法标识
    language = file_path.suffix[1:]  # 去掉点号，获取文件扩展名
    table += f"```\n{content}\n```\n\n"

    table += "------"
    table += "\n\n"
    return table

def main():
    # 获取项目根目录
    root_dir = pathlib.Path.cwd()
    output_file = root_dir / 'source_code_1.md'
    
    # 查找所有源代码文件
    source_files = find_source_files(root_dir)
    
    # 创建输出文件
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Project Source Code\n\n")
        f.write("This document contains all source code files from the project.\n\n")
        
        # 处理每个文件
        for file_path in source_files:
            content = read_file_content(file_path)
            table = create_markdown_table(file_path, content)
            f.write(table)
    
    print(f"Successfully merged {len(source_files)} files into {output_file}")

if __name__ == '__main__':
    main() 