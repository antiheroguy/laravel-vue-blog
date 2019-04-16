<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\UserRequest;
use Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
                $user = Auth::user();
                $user->forceFill(['api_token' => hash('sha256', str_random(60))])->save();
                return response()->json([
                    'status' => true,
                    'user' => $user,
                ]);
            }

            return response()->json([
                'status' => false,
                'message' => 'Email hoặc mật khẩu không đúng',
            ], 401);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function register(UserRequest $request)
    {
        $request->merge(['password' => bcrypt($request->password)]);
        $user = User::create($request->only('name', 'email', 'password'));
        $user->forceFill(['api_token' => hash('sha256', str_random(60))])->save();
        Auth::login($user);
        return response()->json([
            'status' => true,
            'user' => $user,
        ]);
    }
}
