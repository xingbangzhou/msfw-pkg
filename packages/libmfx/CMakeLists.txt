cmake_minimum_required(VERSION 3.14)
project(libdraw)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)

if (NOT CMAKE_BUILD_TYPE)
    set(CMAKE_BUILD_TYPE "Release")
endif()

set(CMAKE_POLICY_DEFAULT_CMP0077 NEW)

file(GLOB_RECURSE LIB_DRAW_FILES src/*.cpp)

add_executable(libdraw ${LIB_DRAW_FILES})

list(APPEND LBD_LINK_OPTIONS --no-entry -lembind -sEXPORT_NAME='LibDraw' -sWASM=1 -sASYNCIFY
        -sUSE_WEBGL2=1 -sEXPORTED_RUNTIME_METHODS=['GL','Asyncify'] -sALLOW_MEMORY_GROWTH=1
        -sMODULARIZE=1 -sENVIRONMENT='web,worker' -sEXPORT_ES6=1 -sUSE_ES6_IMPORT_META=0)
if (CMAKE_BUILD_TYPE STREQUAL "Debug")
    list(APPEND LBD_COMPILE_OPTIONS -O0 -g3)
    list(APPEND LBD_LINK_OPTIONS -O0 -g3 -sSAFE_HEAP=1 -Wno-limited-postlink-optimizations)
else ()
    list(APPEND LBD_COMPILE_OPTIONS -Oz)
    list(APPEND LBD_LINK_OPTIONS -Oz)
endif ()

target_compile_options(libdraw PUBLIC ${LBD_COMPILE_OPTIONS})
target_link_options(libdraw PUBLIC ${LBD_LINK_OPTIONS})

