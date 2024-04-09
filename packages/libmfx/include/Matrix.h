#pragma once
#include <math.h>
#include <cstring>

namespace libdraw
{
#define PI 3.1415926
    typedef float vec3f[3];

    float degToRad(float d)
    {
        return d * PI / 180;
    }

    void normalize(vec3f &const v)
    {
        float len = sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        if (len > 0.00001)
        {
            v[0] = v[0] / len;
            v[1] = v[1] / len;
            v[2] = v[2] / len;
        }
    }

    void subtractVec3(vec3f a, vec3f b, vec3f &const out)
    {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
    }

    void cross(vec3f a, vec3f b, vec3f &const out)
    {
        out[0] = a[1] * b[2] - a[2] * b[1];
        out[1] = a[2] * b[0] - a[0] * b[2];
        out[2] = a[0] * b[1] - a[1] * b[0];
    }

    class Matrix
    {
    public:
        Matrix();

        Matrix(const Matrix &m);

        // 默认矩阵
        static Matrix identity();

        // 透视矩阵
        static Matrix perspective(float fieldOfViewInRadians, float aspect, float near, float far);

        // 平移矩阵
        static Matrix translation(float tx, float ty, float tz);

        static Matrix lookAt(vec3f cameraPosition, vec3f target, vec3f up);

        // 摄像机透视矩阵
        static Matrix perspectiveCamera(float width, float height, float fieldOfViewDeg);

        void xRotate(float angleInRadians);

        void yRotate(float angleInRadians);

        void zRotate(float angleInRadians);

        void scale(float sx, float sy, float sz);

        void inverse();

        Matrix multiply(Matrix m);

        float get(int index) const
        {
            return values[index];
        }

        void set(int index, float value)
        {
            values[index] = value;
        }

        void getValue(float buffer[16]) const
        {
            memcpy(buffer, values, 16 * sizeof(float));
        }

        Matrix &operator=(const Matrix &m);

        float operator[](int index) const
        {
            return values[index];
        }

        float &operator[](int index)
        {
            return values[index];
        }

    private:
        float values[16];
    };
} // namespace libdraw
